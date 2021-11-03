"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const DataBase_1 = require("./lib/DataBase");
class Application {
    constructor(path2db) {
        this.db_obj = new DataBase_1.DataBase();
        this.path2db = path2db;
    }
    loadModule(module_info) {
        let database;
        this.db_obj.initDB(this.path2db).then((answ) => {
            if (answ.result) {
                console.log("WE HAve the connection to DB", module_info);
                database = this.db_obj.getDB();
                database.serialize(() => {
                    database.run("CREATE TABLE test(info TEXT)");
                    database.each(`SELECT * FROM questions`, (err, row) => {
                        if (err) {
                            console.error(err.message);
                        }
                        console.log(row);
                    });
                });
                this.db_obj.closeDB();
            }
            else {
                return answ;
            }
        });
    }
}
exports.Application = Application;

//# sourceMappingURL=../maps/modules/Application.js.map
