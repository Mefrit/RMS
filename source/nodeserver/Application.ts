import { DataBase } from "./modules/lib/DataBase";
import { Module_App } from "./modules/ModuleApp";

export class Application {
    db_obj: any;
    path2db: string;
    constructor(path2db) {
        this.db_obj = new DataBase();
        this.path2db = path2db;
    }
    getModule(module_name) {
        switch (module_name) {
            case "App":
                return Module_App;

            default:
                return undefined;
        }
    }
    loadModule(module_info: any, post_data) {
        return new Promise((resolve, reject) => {
            this.db_obj.initDB(this.path2db).then((answ) => {
                if (answ.result) {
                    // const database = this.db_obj.getDB();
                    // console.log(database);
                    const Module = this.getModule(module_info.module);
                    if (Module) {
                        const obj = new Module({ db_obj: this.db_obj });
                        obj.runtAction(module_info.action, post_data).then((answer) => {
                            console.log("answer ======>>>>>> ", answer);
                            resolve(answer);
                        });
                    } else {
                        resolve({ result: false, message: "Произошла ошибка при загрузке модуля." });
                    }
                } else {
                    resolve(answ);
                }
            });
        });
    }
}
