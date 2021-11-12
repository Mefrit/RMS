"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBase = void 0;
const sqlite3 = require("sqlite3").verbose();
class DataBase {
    constructor() {
        this.db = undefined;
    }
    initDB(path2db) {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(path2db, (err) => {
                if (err) {
                    resolve({ result: false, message: "Ошибка при подключении к базе данных. " + err.message });
                }
                resolve({ result: true });
            });
        });
    }
    closeDB() {
        this.db.close((err) => {
            if (err) {
                return { result: false, message: "Ошибка при закрытии базы данных. " + err.message };
            }
            return { result: true };
        });
        this.db = undefined;
    }
    getDB() {
        return this.db;
    }
}
exports.DataBase = DataBase;

//# sourceMappingURL=../../maps/modules/lib/DataBase.js.map
