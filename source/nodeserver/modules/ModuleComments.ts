import { Module_Default } from "./lib/ModuleDefault";
// первый пункт просто отправить все комментарии к вопросу,
// второй сгенерировать комментарии + вручную добавить продключение в cis
// реализовать возможность с помощью ссылки ,содержащую айдишник пользователя cis добавлять комментарии
export class Module_Comments extends Module_Default {
    async actionAddComment(post_data: any) {
        return new Promise(async (resolve, reject) => {
            const database = this.db.getDBSqlite();
            database.serialize(() => {
                database.run(
                    "INSERT INTO comments(id_user, comment, time_receipt, id_question) VALUES(?, ?, ?, ?)",
                    [post_data.id_user, post_data.comment, post_data.time_receipt, post_data.id_question],
                    (err, rows) => {
                        if (err) {
                            return resolve({
                                result: false,
                                message: "Не удалось добавить комментарий." + err.message,
                            });
                        }
                        database.all("SELECT MAX(id_comment ) as id from comments", function (err, last_id) {
                            if (err) {
                                return resolve({
                                    result: false,
                                    message: "Не удалось добавить комментарий." + err.message,
                                });
                            }
                            return resolve({ result: true, id_comment: last_id[0].id });
                        });
                    }
                );
            });
        });
    }

    async actionGetInfoComments(post_data: any) {
        return new Promise(async (resolve, reject) => {
            const db_sqlite = this.db.getDBSqlite();
            const db_cis = this.db.getDBCis();

            const question_answ: any = await this.makeRequestSqliteDB(
                db_sqlite,
                "SELECT question, time_receipt FROM questions WHERE id_question=" + post_data.id_question
            );
            let question;
            if (question_answ.result) {
                question = question_answ.rows[0];
            } else {
                question = "Не удалось загрузить вопрос.";
            }
            const comments_answ: any = await this.makeRequestSqliteDB(
                db_sqlite,
                "SELECT comment, id_comment, id_user FROM Comments WHERE id_question=" + post_data.id_question
            );

            let cache_id_users = [],
                comments,
                users_info;
            if (comments_answ.result) {
                comments = comments_answ.rows;
                comments_answ.rows.forEach((comment) => {
                    if (cache_id_users.indexOf(comment.id_user) == -1) {
                        cache_id_users.push(comment.id_user);
                    }
                });
                const users_info_answ: any = await this.makeRequestCisDB(
                    db_cis,
                    "SELECT name_i, name_f,id_user FROM users WHERE id_user IN (" + cache_id_users.join(",") + ")"
                );
                if (users_info_answ.result) {
                    users_info = users_info_answ.rows;
                } else {
                    comments = [];
                }
            } else {
                resolve({ result: false, message: "Не удалось загрузить комментарии к вопросу." });
            }

            resolve({
                result: true,
                answer: { comments: comments, question: question, users_info: users_info, id_user: post_data.id_user },
            });
        });
    }
}
