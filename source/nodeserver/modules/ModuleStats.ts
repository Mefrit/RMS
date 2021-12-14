import { Module_Default } from "./lib/ModuleDefault";

export class Module_Stats extends Module_Default {
    actionGetStats = (post_data: any) => {
        return new Promise(async (resolve, reject) => {
            const database = this.db.getDBSqlite();
            // const numb_record_start = (post_data.page - 1) * post_data.on_page;
            // const numb_record_finish = post_data.page * post_data.on_page;
            // database.serialize(() => {
            //     database.all(
            //         `SELECT  COUNT(*) as count_request, strftime('%d-%m-%Y', time_receipt/1000, 'unixepoch') as date FROM questions WHERE time_receipt>'${post_data.time_start}'
            //          AND time_receipt<'${post_data.time_end}' GROUP BY strftime('%d-%m-%Y', time_receipt/1000, 'unixepoch') ORDER BY time_receipt `,
            //         function (err, rows) {
            //             if (err) {
            //                 resolve({ result: false, list: [], message: err.message });
            //             }
            //             resolve({ result: true, list: rows });
            //         }
            //     );
            // });
            const total_info: any = await this.makeRequestSqliteDB(
                database,
                `SELECT  COUNT(*) as count, strftime('%d-%m-%Y', time_receipt/1000, 'unixepoch') as date FROM questions WHERE time_receipt>'${post_data.time_start}'
                AND time_receipt<'${post_data.time_end}' GROUP BY strftime('%d-%m-%Y', time_receipt/1000, 'unixepoch') ORDER BY time_receipt `
            );
            const answered_info: any = await this.makeRequestSqliteDB(
                database,
                `SELECT  COUNT(*) as count, strftime('%d-%m-%Y', time_answering/1000, 'unixepoch') as date FROM questions WHERE time_answering>'${post_data.time_start}'
                AND time_answering<'${post_data.time_end}' AND time_answering IS NOT NULL GROUP BY strftime('%d-%m-%Y', time_answering/1000, 'unixepoch') ORDER BY time_answering `
            );
            if (answered_info.result && total_info.result) {
                resolve({ result: true, total_info: { cache: total_info.rows, line_title: "Все письма" }, answered_info: { cache: answered_info.rows, line_title: "Отвеченные письма" } });
            } else {
                if (!total_info.result) {
                    resolve({ result: false, list: [], message: "Не удалось собрать данные для " + total_info.message });
                } else {
                    resolve({ result: false, list: [], message: "Не удалось собрать данные для " + answered_info.message });
                }

            }
        });
    };
}
