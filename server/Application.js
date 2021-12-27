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
const ModuleAnswer_1 = require("./modules/ModuleAnswer");
const ModuleStats_1 = require("./modules/ModuleStats");
class Application {
    constructor(path2dbsqlite, cis_connect) {
        this.db = new DataBase_1.DataBase();
        this.path2dbsqlite = path2dbsqlite;
        this.cis_connect = cis_connect;
    }
    getModule(module_name) {
        switch (module_name) {
            case "App":
                return ModuleApp_1.Module_App;
            case "Teacher":
                return ModuleTeacher_1.Module_Teacher;
            case "Comments":
                return ModuleComments_1.Module_Comments;
            case "Answer":
                return ModuleAnswer_1.Module_Answer;
            case "Stats":
                return ModuleStats_1.Module_Stats;
            default:
                return undefined;
        }
    }
    getDbConnection() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const answ_sqlite = yield this.db.initDBSqlite(this.path2dbsqlite);
            const answ_cis = yield this.db.initDBCis(this.cis_connect);
            if (answ_sqlite.result && answ_cis.result) {
                resolve({ result: true, db_cis: this.db.getDBCis(), db_sqlite: this.db.getDBSqlite() });
            }
            else {
                if (!answ_sqlite.result) {
                    resolve(answ_sqlite);
                }
                resolve(answ_cis);
            }
        }));
    }
    loadModule(post_data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.getDbConnection().then((data) => {
                if (data.result) {
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
                    resolve(data);
                }
            });
        }));
    }
}
exports.Application = Application;

//# sourceMappingURL=maps/Application.js.map
