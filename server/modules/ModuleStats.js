"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_Stats = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
class Module_Stats extends ModuleDefault_1.Module_Default {
    constructor() {
        super(...arguments);
        this.actionGetStats = (post_data) => {
            return new Promise((resolve, reject) => {
                const database = this.db.getDBSqlite();
                database.serialize(() => {
                    database.all(`SELECT  COUNT(id_question) as count ,strftime('%Y-%d-%m','time_receipt') as date FROM questions WHERE time_receipt>'${post_data.time_start}' AND time_receipt<'${post_data.time_end}'  `, function (err, rows) {
                        if (err) {
                            resolve({ result: false, list: [], message: err.message });
                        }
                        resolve({ result: true, list: rows });
                    });
                });
            });
        };
    }
}
exports.Module_Stats = Module_Stats;

//# sourceMappingURL=../maps/modules/ModuleStats.js.map
