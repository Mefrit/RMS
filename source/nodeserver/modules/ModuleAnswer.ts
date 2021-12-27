import { Module_Default } from "./lib/ModuleDefault";
// первый пункт просто отправить все комментарии к вопросу,
// второй сгенерировать комментарии + вручную добавить продключение в cis
// реализовать возможность с помощью ссылки ,содержащую айдишник пользователя cis добавлять комментарии
export class Module_Answer extends Module_Default {
    async actionSetTimeAnswering(post_data) {
        return new Promise(async (resolve, reject) => {
            const db_sqlite = this.db.getDBSqlite();
            const answ: any = await this.makeRequestSqliteDB(
                db_sqlite,
                `UPDATE questions SET time_answering=${post_data.time} WHERE id_question=${post_data.id_question}`
            );
            if (answ.result) {
                resolve({ result: true });
            } else {
                resolve({
                    result: false,
                    message: "письмо отправлено, но не удалось обновить дату отправления сообщения в базе данных.",
                });
            }
        });
    }
    async actionGetQuestion(post_data: any) {
        return new Promise(async (resolve, reject) => {
            const db_sqlite = this.db.getDBSqlite();
            const question_answ: any = await this.makeRequestSqliteDB(
                db_sqlite,
                "SELECT question, time_receipt, type_platform FROM questions WHERE id_question=" + post_data.id_question
            );
            let question;
            if (question_answ.result) {
                question = question_answ.rows[0];
            } else {
                question = "Не удалось загрузить вопрос.";
            }
            resolve({
                result: true,
                answer: question,
            });
        });
    }
}
