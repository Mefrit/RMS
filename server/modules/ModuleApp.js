"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_App = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
class Module_App extends ModuleDefault_1.Module_Default {
    constructor() {
        super(...arguments);
        this.getList = (post_data) => {
            return new Promise((resolve, reject) => {
                let answer = { result: true };
                const database = this.db_obj.getDB();
                const numb_record_start = (post_data.page - 1) * post_data.on_page;
                const numb_record_finish = post_data.page * post_data.on_page;
                database.serialize(() => {
                    database.all(`SELECT question,is_answered,time_receipt,time_answering FROM questions ORDER BY ${post_data.order} LIMIT ${numb_record_start} , ${numb_record_finish}`, function (err, rows) {
                        answer.list = rows;
                        resolve(answer);
                    });
                });
            });
        };
    }
}
exports.Module_App = Module_App;

//# sourceMappingURL=../maps/modules/ModuleApp.js.map
