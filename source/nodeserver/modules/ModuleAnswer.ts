import { Module_Default } from "./lib/ModuleDefault";
import * as nodemailer from "nodemailer";
import * as fs from "fs";
// первый пункт просто отправить все комментарии к вопросу,
// второй сгенерировать комментарии + вручную добавить продключение в cis
// реализовать возможность с помощью ссылки ,содержащую айдишник пользователя cis добавлять комментарии
export class Module_Answer extends Module_Default {
    // async actionAddComment(post_data: any) {
    //     return new Promise(async (resolve, reject) => {
    //         console.log("add Comment", post_data);
    //         const database = this.db.getDBSqlite();
    //         database.serialize(() => {
    //             database.run('INSERT INTO comments(id_user, comment, time_receipt, id_question) VALUES(?, ?, ?, ?)',
    //                 [post_data.id_user, post_data.comment, post_data.time_receipt, post_data.id_question], (err, rows) => {
    //                     if (err) {
    //                         return resolve({ result: false, message: "Не удалось добавить комментарий." + err.message })
    //                     }
    //                     database.all('SELECT MAX(id_comment ) as id from comments', function (err, last_id) {
    //                         if (err) {
    //                             return resolve({ result: false, message: "Не удалось добавить комментарий." + err.message })
    //                         }
    //                         return resolve({ result: true, id_comment: last_id[0].id })
    //                     });
    //                 })
    //         });
    //     });
    // }
    // async actionSentAnswer(post_data: any) {
    //     return new Promise(async (resolve, reject) => {
    //         console.log("Sent ASnswer !!!!!", post_data)
    //         // let testEmailAccount = await nodemailer.createTestAccount()
    //         fs.readFile("./img.png", function (err, data) {
    //             console.log(err)
    //             const transporter = nodemailer.createTransport({
    //                 service: 'gmail',
    //                 auth: {
    //                     user: 'mefrit.1999@gmail.com',
    //                     pass: '56189968',
    //                 }
    //             });
    //             const mailData = {
    //                 from: 'mefrit.1999@gmail.com',  // sender address
    //                 to: 'mihail_fokin_1999@mail.ru',   // list of receivers
    //                 subject: 'Sending Email using Node.js',
    //                 text: 'That was easy!',
    //                 // attachments: [{ 'filename': 'img.png', 'content': data }]
    //                 // html: '<b>Hey there! </b> <br> This is our first message sent with Nodemailer <br/> ',
    //             };
    //             transporter.sendMail(mailData, function (err, info) {
    //                 if (err)
    //                     console.log(err)
    //                 else
    //                     console.log("info ==>>> ", info);
    //             });
    //         });
    //         // console.log("result ==>> ", result)
    //         resolve({ result: false, message: "Письмо не отправлено" })
    //     });
    // }
    async actionSetTimeAnswering(post_data) {
        return new Promise(async (resolve, reject) => {
            const db_sqlite = this.db.getDBSqlite();
            console.log("\n\n\n", post_data, "\n\n\n", `UPDATE question SET time_answering='${post_data.time}' WHERE id_question='${post_data.id_question}'`);
            const answ: any = await this.makeRequestSqliteDB(
                db_sqlite,
                `UPDATE questions SET time_answering=${post_data.time} WHERE id_question=${post_data.id_question}`
            );
            if (answ.result) {
                resolve({ result: true })
            } else {
                resolve({ result: false, message: "письмо отправлено, но не удалось обновить дату отправления сообщения в базе данных." })
            }
        });
    }
    async actionGetQuestion(post_data: any) {
        return new Promise(async (resolve, reject) => {
            const db_sqlite = this.db.getDBSqlite();
            // const db_cis = this.db.getDBCis();

            const question_answ: any = await this.makeRequestSqliteDB(
                db_sqlite,
                "SELECT question, time_receipt, type_platform FROM questions WHERE id_question=" + post_data.id_question
            );
            let question
            if (question_answ.result) {
                console.log(question_answ.rows[0]);
                question = question_answ.rows[0];
            } else {
                question = "Не удалось загрузить вопрос."
            }
            // const comments_answ: any = await this.makeRequestSqliteDB(
            //     db_sqlite,
            //     "SELECT comment, id_comment, id_user FROM Comments WHERE id_question=" + post_data.id_question
            // );
            // let cache_id_users = [], comments, users_info;
            // if (comments_answ.result) {
            //     comments = comments_answ.rows;
            //     comments_answ.rows.forEach((comment) => {
            //         if (cache_id_users.indexOf(comment.id_user) == -1) {
            //             cache_id_users.push(comment.id_user);
            //         }
            //     });
            //     const users_info_answ: any = await this.makeRequestCisDB(
            //         db_cis,
            //         "SELECT name_i, name_f,id_user FROM users WHERE id_user IN (" + cache_id_users.join(",") + ")"
            //     );
            //     if (users_info_answ.result) {
            //         users_info = users_info_answ.rows;
            //     } else {
            //         comments = [];
            //     }
            // } else {
            //     resolve({ result: false, message: "Не удалось загрузить комментарии к вопросу." });
            // }


            console.log("!!!!!!!!!!!!!! comments");
            resolve({
                result: true,
                answer: question,
            });

        });
    }
}
