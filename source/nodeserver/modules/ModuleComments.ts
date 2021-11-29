
import { Module_Default } from "./lib/ModuleDefault";
// первый пункт просто отправить все комментарии к вопросу,
// второй сгенерировать комментарии + вручную добавить продключение в cis
// реализовать возможность с помощью ссылки ,содержащую айдишник пользователя cis добавлять комментарии
export class Module_Comments extends Module_Default {
    async actionGetComments(post_data: any) {
        return new Promise(async (resolve, reject) => {
            const db_sqlite = this.db.getDBSqlite();
            const db_cis = this.db.getDBCis();
            console.log(
                "post_data comments",
                post_data
            );
            const comments: any = await this.makeRequestSqliteDB(
                db_sqlite,
                "SELECT comment, id_comment, id_user FROM Comments WHERE id_question=" + post_data.id_question
            );
            // const user_info = await this.makeRequestCisDB(
            //     db_cis,
            //     "SELECT * FROM users WHERE id_user=" + post_data.id_user
            // );
            // console.log(user_info);
            // db_cis.query('SELECT * FROM users  ', (err, res) => {
            //     console.log("res111111", res);
            //     db_cis.end()
            // })
            const question = "";
            // console.log("comments ===> ", comments);
            if (comments.result) {
                resolve({ result: true, answer: { comments: comments.rows, question: question } });
            }
            resolve({ result: false, message: "Не удалось загрузить комментарии к вопросу." });
        });
    }
}