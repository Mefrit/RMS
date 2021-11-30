import { DataBase } from "./modules/lib/DataBase";
import { Module_App } from "./modules/ModuleApp";
import { Module_Teacher } from "./modules/ModuleTeacher";
import { Module_Comments } from "./modules/ModuleComments";
export class Application {
    db: any;
    path2db: string;
    constructor(path2db) {
        this.db = new DataBase();
        this.path2db = path2db;
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
    loadModule(module_info: any, post_data) {
        return new Promise(async (resolve, reject) => {
            const answ_sqlite = await this.db.initDBSqlite(this.path2db);
            const answ_cis = await this.db.initDBCis(this.path2db);

            if (answ_sqlite.result && answ_cis.result) {
                const Module = this.getModule(module_info.module);
                if (Module) {
                    const obj = new Module({ db: this.db });
                    obj.runtAction(module_info.action, post_data).then((answer) => {
                        resolve(answer);
                    });
                } else {
                    resolve({ result: false, message: "Произошла ошибка при загрузке модуля. Модуль не найден" });
                }
            } else {
                if (answ_sqlite.result) {
                    resolve(answ_sqlite);
                }
                resolve(answ_cis);
            }
        });
    }
}
