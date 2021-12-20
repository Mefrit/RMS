import { Module_Default } from "./lib/ModuleDefault";

export class Module_App extends Module_Default {
    actionGetList = (post_data: any) => {
        return new Promise((resolve, reject) => {
            const database = this.db.getDBSqlite();
            // const numb_record_start = (post_data.page - 1) * post_data.on_page;
            const on_page = post_data.on_page;
            database.serialize(() => {
                database.all(
                    `SELECT  id_question,question,time_receipt,time_answering FROM questions ORDER BY ${post_data.order} LIMIT ${0}, ${on_page + 6}`,
                    function (err, rows) {
                        if (err) {
                            resolve({ result: false, list: [], message: err.message, on_page: on_page + 6 });
                        }

                        resolve({ result: true, list: rows });
                    }
                );
            });
        });
    };
    actionGetMessage = (post_data: any) => {
        return new Promise((resolve, reject) => {
            const database = this.db.getDBSqlite();
            const id_question = post_data.id_question;
            database.serialize(() => {
                database.all(
                    `SELECT  question FROM questions WHERE id_question=${id_question}`, function (err, rows) {
                        if (err) {
                            resolve({ result: false, message: err.message });
                        }
                        resolve({ result: true, question: rows[0].question });
                    }
                );

            });
        });
    };
}
