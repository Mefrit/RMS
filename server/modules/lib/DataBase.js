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
exports.DataBase = void 0;
const sqlite3 = require("sqlite3").verbose();
const pg_1 = require("pg");
class DataBase {
    constructor() {
        this.db_sqlite = undefined;
        this.db_cis = undefined;
    }
    initDBSqlite(path2db) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.db_sqlite = new sqlite3.Database(path2db, (err) => {
                    if (err) {
                        resolve({ result: false, message: "Ошибка при подключении к базе данных. " + err.message });
                    }
                    resolve({ result: true });
                });
            });
        });
    }
    initDBCis(cis_connect) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const client = new pg_1.Client(cis_connect);
                client.connect();
                if (client) {
                    this.db_cis = client;
                    resolve({ result: true });
                }
                resolve({ result: false, message: "Не удалось подключитсья к базе данных Postgress" });
            });
        });
    }
    closeDBSqlite() {
        this.db_sqlite.close((err) => {
            if (err) {
                return { result: false, message: "Ошибка при закрытии базы данных. " + err.message };
            }
            return { result: true };
        });
        this.db_sqlite = undefined;
    }
    getDBCis() {
        return this.db_cis;
    }
    getDBSqlite() {
        return this.db_sqlite;
    }
}
exports.DataBase = DataBase;

//# sourceMappingURL=../../maps/modules/lib/DataBase.js.map
