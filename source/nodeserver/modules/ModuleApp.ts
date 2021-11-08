import { Module_Default } from "./lib/ModuleDefault";

export class Module_App extends Module_Default {
    actionGetList = (post_data: any) => {
        return new Promise((resolve, reject) => {
            let answer: any = { result: true };
            const database = this.db_obj.getDB();
            const numb_record_start = (post_data.page - 1) * post_data.on_page;
            const numb_record_finish = post_data.page * post_data.on_page;

            database.serialize(() => {
                database.all(
                    `SELECT question,is_answered,time_receipt,time_answering FROM questions ORDER BY ${post_data.order} LIMIT ${numb_record_start} , ${numb_record_finish}`,
                    function (err, rows) {
                        answer.list = rows;

                        resolve(answer);
                    }
                );
            });
        });
    };
}
