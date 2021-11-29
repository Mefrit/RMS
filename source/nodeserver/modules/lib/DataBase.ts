const sqlite3 = require("sqlite3").verbose();
import { Client } from "pg";
export class DataBase {
    db_sqlite: any;
    db_cis: any;
    constructor() {
        this.db_sqlite = undefined;
        this.db_cis = undefined
    }
    async initDBSqlite(path2db) {
        return new Promise((resolve, reject) => {
            this.db_sqlite = new sqlite3.Database(path2db, (err) => {
                if (err) {
                    resolve({ result: false, message: "Ошибка при подключении к базе данных. " + err.message });
                }
                resolve({ result: true });
            });
        });
    }
    async initDBCis() {
        return new Promise((resolve, reject) => {
            const client = new Client({
                user: "cis",
                host: "localhost",
                database: "db_cis",
                password: "cis_passwd",
                port: 5432,
            });
            client.connect()
            if (client) {
                this.db_cis = client;
                resolve({ result: true });
            }
            resolve({ result: false, message: "Не удалось подключитсья к базе данных Postgress" });
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
