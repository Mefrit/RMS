"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const DataBase_1 = require("./modules/lib/DataBase");
const ModuleApp_1 = require("./modules/ModuleApp");
const ModuleTeacher_1 = require("./modules/ModuleTeacher");
const ModuleComments_1 = require("./modules/ModuleComments");
class Application {
    constructor(path2db) {
        this.db_obj = new DataBase_1.DataBase();
        this.path2db = path2db;
    }
    getModule(module_name) {
        switch (module_name) {
            case "App":
                return ModuleApp_1.Module_App;
            case "Teacher":
                return ModuleTeacher_1.Module_Teacher;
            case "Comments":
                return ModuleComments_1.Module_Comments;
            default:
                return undefined;
        }
    }
    loadModule(module_info, post_data) {
        return new Promise((resolve, reject) => {
            this.db_obj.initDB(this.path2db).then((answ) => {
                if (answ.result) {
                    const Module = this.getModule(module_info.module);
                    if (Module) {
                        const obj = new Module({ db_obj: this.db_obj });
                        obj.runtAction(module_info.action, post_data).then((answer) => {
                            resolve(answer);
                        });
                    }
                    else {
                        resolve({ result: false, message: "Произошла ошибка при загрузке модуля. Модуль не найден" });
                    }
                }
                else {
                    resolve(answ);
                }
            });
        });
    }
}
exports.Application = Application;

//# sourceMappingURL=maps/Application.js.map
