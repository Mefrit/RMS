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
const pg_1 = require("pg");
class Module_Default {
    constructor(props) {
        this.makeRequestToDb = (database, sql) => __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                database.serialize(() => {
                    database.all(sql, function (err, rows) {
                        if (err) {
                            resolve({ result: false });
                        }
                        resolve({ result: true, rows: rows });
                    });
                });
            });
        });
        this.db_obj = props.db_obj;
    }
    getCisBd() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new pg_1.Client({
                user: "cis",
                host: "localhost",
                database: "db_cis",
                password: "cis_passwd",
                port: 5432,
            });
            yield client.connect();
            const query = "SELECT * FROM users";
            console.log("EHREEEE CISSS!!!!!!!!!!!!!!!!!! ", client);
            client.query(query, (err, res) => {
                if (err) {
                    console.error("getCisBd ", err);
                    return;
                }
                console.log(" getCisBd ===>>>> Table is successfully created", res);
                client.end();
            });
        });
    }
    runtAction(name_action, data) {
        return this["action" + name_action](data);
    }
}
exports.Module_Default = Module_Default;

//# sourceMappingURL=../../maps/modules/lib/ModuleDefault.js.map
