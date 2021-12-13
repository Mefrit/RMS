import { Module_Default } from "./lib/ModuleDefault";

export class Module_Stats extends Module_Default {
    actionGetStats = (post_data: any) => {
        return new Promise((resolve, reject) => {
            const database = this.db.getDBSqlite();
            // const numb_record_start = (post_data.page - 1) * post_data.on_page;
            // const numb_record_finish = post_data.page * post_data.on_page;
            database.serialize(() => {
                // SELECT `updated_at`,FROM_UNIXTIME(`updated_at`,'%Y-%d-%m') daydate FROM `table` GROUP BY FROM_UNIXTIME(`updated_at`,'%Y-%d-%m')
                database.all(
                    `SELECT  COUNT(id_question) as count ,strftime('%Y-%d-%m','time_receipt') as date FROM questions WHERE time_receipt>'${post_data.time_start}' AND time_receipt<'${post_data.time_end}'  `,
                    function (err, rows) {
                        if (err) {
                            resolve({ result: false, list: [], message: err.message });
                        }

                        resolve({ result: true, list: rows });
                    }
                );
            });
        });
    };
    // actionGetMessage = (post_data: any) => {
    //     return new Promise((resolve, reject) => {
    //         const database = this.db.getDBSqlite();
    //         const id_question = post_data.id_question;

    //         database.serialize(() => {
    //             database.all(
    //                 `SELECT  question FROM questions WHERE id_question=${id_question}`, function (err, rows) {
    //                     if (err) {
    //                         resolve({ result: false, message: err.message });
    //                     }
    //                     resolve({ result: true, question: rows[0].question });
    //                 }
    //             );

    //         });
    //     });
    // };
}
