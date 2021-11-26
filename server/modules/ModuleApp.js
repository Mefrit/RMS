"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_App = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
class Module_App extends ModuleDefault_1.Module_Default {
    constructor() {
        super(...arguments);
        this.actionGetList = (post_data) => {
            return new Promise((resolve, reject) => {
                const database = this.db_obj.getDB();
                const numb_record_start = (post_data.page - 1) * post_data.on_page;
                const numb_record_finish = post_data.page * post_data.on_page;
                database.serialize(() => {
                    database.all(`SELECT  id_question,question,is_answered,time_receipt,time_answering FROM questions ORDER BY ${post_data.order} LIMIT ${numb_record_start} , ${numb_record_finish}`, function (err, rows) {
                        if (err) {
                            resolve({ result: false, list: [], message: err.message });
                        }
                        resolve({ result: true, list: rows });
                    });
                });
            });
        };
        this.actionGetMessage = (post_data) => {
            return new Promise((resolve, reject) => {
                const database = this.db_obj.getDB();
                const id_question = post_data.id_question;
                database.serialize(() => {
                    database.all(`SELECT  question FROM questions WHERE id_question=${id_question}`, function (err, rows) {
                        if (err) {
                            resolve({ result: false, message: err.message });
                        }
                        resolve({ result: true, question: rows[0].question });
                    });
                });
            });
        };
    }
}
exports.Module_App = Module_App;

//# sourceMappingURL=../maps/modules/ModuleApp.js.map
