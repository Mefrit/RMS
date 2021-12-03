"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const DataBase_1 = require("./modules/lib/DataBase");
const ModuleApp_1 = require("./modules/ModuleApp");
const ModuleTeacher_1 = require("./modules/ModuleTeacher");
const ModuleComments_1 = require("./modules/ModuleComments");
class Application {
    constructor(path2db) {
        this.db = new DataBase_1.DataBase();
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
    loadModule(post_data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const answ_sqlite = yield this.db.initDBSqlite(this.path2db);
            const answ_cis = yield this.db.initDBCis();
            if (answ_sqlite.result && answ_cis.result) {
                const Module = this.getModule(post_data.module);
                if (Module) {
                    const obj = new Module({ db: this.db });
                    obj.runtAction(post_data.action, post_data).then((answer) => {
                        resolve(answer);
                    });
                }
                else {
                    resolve({ result: false, message: "Произошла ошибка при загрузке модуля. Модуль не найден" });
                }
            }
            else {
                if (!answ_sqlite.result) {
                    resolve(answ_sqlite);
                }
                resolve(answ_cis);
            }
        }));
    }
}
exports.Application = Application;

//# sourceMappingURL=maps/Application.js.map
