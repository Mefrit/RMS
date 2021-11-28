import { Module_Default } from "./lib/ModuleDefault";
// первый пункт просто отправить все комментарии к вопросу,
// второй сгенерировать комментарии + вручную добавить продключение в cis
// реализовать возможность с помощью ссылки ,содержащую айдишник пользователя cis добавлять комментарии
export class Module_Comments extends Module_Default {
    async actionGetComments(post_data: any) {
        return new Promise(async (resolve, reject) => {
            const database = this.db_obj.getDB();
            console.log(
                "post_data comments",
                post_data,
                "SELECT question,time_receipt FROM Comments WHERE id_question=" + post_data.id_question
            );
            const comments: any = await this.makeRequestToDb(
                database,
                "SELECT comment, id_comment FROM Comments WHERE id_question=" + post_data.id_question
            );
            this.getCisBd();
            const question = "";
            console.log("comments ===> ", comments);
            if (comments.result) {
                resolve({ result: true, answer: { comments: comments.rows, question: question } });
            }
            resolve({ result: false, message: "Не удалось загрузить комментарии к вопросу." });
        });
    }
}
