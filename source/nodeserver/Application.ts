import { DataBase } from "./modules/lib/DataBase";
import { Module_App } from "./modules/ModuleApp";
import { Module_Teacher } from "./modules/ModuleTeacher";
import { Module_Comments } from "./modules/ModuleComments";
import { rejects } from "assert";
export class Application {
    db: any;
    cis_connect: any
    path2dbsqlite: string;
    constructor(path2dbsqlite, cis_connect) {
        this.db = new DataBase();
        this.path2dbsqlite = path2dbsqlite;
        this.cis_connect = cis_connect;
    }
    getModule(module_name) {
        switch (module_name) {
            case "App":
                return Module_App;
            case "Teacher":
                return Module_Teacher;
            case "Comments":
                return Module_Comments;
            default:
                return undefined;
        }
    }
    // getDbCis() {
    //     const db_cis = this.db.getDBCis();
    // }
    getDbConnection() {
        return new Promise(async (resolve, reject) => {
            const answ_sqlite = await this.db.initDBSqlite(this.path2dbsqlite);
            const answ_cis = await this.db.initDBCis(this.cis_connect);

            if (answ_sqlite.result && answ_cis.result) {
                resolve({ result: true, db_cis: this.db.getDBCis(), db_sqlite: this.db.getDBSqlite() });
            } else {
                if (!answ_sqlite.result) {
                    resolve(answ_sqlite);
                }
                resolve(answ_cis);
            }

        });
    }
    loadModule(post_data) {
        return new Promise(async (resolve, reject) => {
            // const answ_sqlite = await this.db.initDBSqlite(this.path2dbsqlite);
            // const answ_cis = await this.db.initDBCis(this.cis_connect);
            this.getDbConnection().then((data: any) => {
                if (data.result) {
                    const Module = this.getModule(post_data.module);
                    if (Module) {
                        const obj = new Module({ db: this.db });
                        obj.runtAction(post_data.action, post_data).then((answer) => {
                            resolve(answer);
                        });
                    } else {
                        resolve({ result: false, message: "Произошла ошибка при загрузке модуля. Модуль не найден" });
                    }
                } else {
                    resolve(data);
                }
            })

        });
    }
}
