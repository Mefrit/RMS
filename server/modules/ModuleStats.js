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
exports.Module_Stats = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
class Module_Stats extends ModuleDefault_1.Module_Default {
    constructor() {
        super(...arguments);
        this.actionGetStats = (post_data) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const database = this.db.getDBSqlite();
                const total_info = yield this.makeRequestSqliteDB(database, `SELECT  COUNT(*) as count, strftime('%d-%m-%Y', time_receipt/1000, 'unixepoch') as date FROM questions WHERE time_receipt>'${post_data.time_start}'
                AND time_receipt<'${post_data.time_end}' GROUP BY strftime('%d-%m-%Y', time_receipt/1000, 'unixepoch') ORDER BY time_receipt `);
                const answered_info = yield this.makeRequestSqliteDB(database, `SELECT  COUNT(*) as count, strftime('%d-%m-%Y', time_answering/1000, 'unixepoch') as date FROM questions WHERE time_answering>'${post_data.time_start}'
                AND time_answering<'${post_data.time_end}' AND time_answering IS NOT NULL GROUP BY strftime('%d-%m-%Y', time_answering/1000, 'unixepoch') ORDER BY time_answering `);
                if (answered_info.result && total_info.result) {
                    resolve({ result: true, total_info: { cache: total_info.rows, line_title: "Все письма" }, answered_info: { cache: answered_info.rows, line_title: "Отвеченные письма" } });
                }
                else {
                    if (!total_info.result) {
                        resolve({ result: false, list: [], message: "Не удалось собрать данные для " + total_info.message });
                    }
                    else {
                        resolve({ result: false, list: [], message: "Не удалось собрать данные для " + answered_info.message });
                    }
                }
            }));
        };
    }
}
exports.Module_Stats = Module_Stats;

//# sourceMappingURL=../maps/modules/ModuleStats.js.map
