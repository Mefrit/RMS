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
exports.Module_Default = void 0;
class Module_Default {
    constructor(props) {
        this.makeRequestCisDB = (database, sql) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database.query(sql, (err, res) => {
                    if (err) {
                        resolve({ result: false, message: err.message });
                    }
                    if (res) {
                        resolve({ result: true, rows: res.rows });
                    }
                    else {
                        resolve({ result: true, rows: [] });
                    }
                    database.end();
                });
            });
        });
        this.makeRequestSqliteDB = (database, sql) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database.serialize(() => {
                    database.all(sql, function (err, rows) {
                        if (err) {
                            resolve({ result: false, message: err.message });
                        }
                        resolve({ result: true, rows: rows });
                    });
                });
            });
        });
        this.db = props.db;
    }
    runtAction(name_action, data) {
        return this["action" + name_action](data);
    }
}
exports.Module_Default = Module_Default;

//# sourceMappingURL=../../maps/modules/lib/ModuleDefault.js.map
