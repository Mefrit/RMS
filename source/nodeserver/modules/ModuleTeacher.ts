import { Module_Default } from "./lib/ModuleDefault";
import { Bayes } from "../modules/lib/bayes";
export class Module_Teacher extends Module_Default {
    actionGetDocsList = (post_data: any) => {
        return new Promise((resolve, reject) => {
            console.log("getDocsList");
            const database = this.db_obj.getDB();
            console.log("post_data ==> ", post_data);
            if (post_data.type_resource == "cms") {
                // database.serialize(() => {
                //     // FIX ME переделать, клогда будем добавлять ссылки из cis
                //     // database.all(`SELECT * FROM links`, function (err, rows) {
                //     //     if (err) {
                //     //         resolve({ result: false, message: "Не удалось загрузить ссылки на документацию" });
                //     //     }
                //     //     resolve({ result: true, docs_links: rows });
                //     // });

                this.getDocsLinks(database, `SELECT * FROM links`).then((answer: any) => {
                    if (answer.result) {
                        resolve({ result: true, docs_links: answer.rows });
                    }
                    resolve({ result: false, message: "Не удалось загрузить ссылки на документацию" });
                })

            } else {
                resolve({ result: false, message: "Не удалось загрузить ссылки на документацию в CIS." });
            }
        });
    };
    getDocsLinks(database, sql) {
        return new Promise((resolve, reject) => {
            database.serialize(() => {
                // FIX ME переделать, клогда будем добавлять ссылки из cis
                database.all(sql, function (err, rows) {

                    if (err) {
                        resolve({ result: false });
                    }
                    resolve({ result: true, rows: rows });
                });
            });
        })
    }
    actionGetRecomendation(post_data: any) {
        return new Promise((resolve, reject) => {
            console.log("actionGetRecomendation", post_data);
            const train_byes = new Bayes("");
            const database = this.db_obj.getDB();
            const type_resource = post_data.type_resource;

            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform = pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer: any) => {

                if (answer.result) {
                    console.log("post_data", post_data);

                    resolve({ result: true, links: train_byes.getRecomendation(post_data.letter, answer.rows) });
                }
                resolve({ result: false, message: "Не удалось обучить алгоритм" });
            })

        });
    }
    actionTrain(post_data: any) {
        return new Promise((resolve, reject) => {
            const train_byes = new Bayes("");
            const database = this.db_obj.getDB();
            const type_resource = post_data.type_resource;
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform =  pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer: any) => {

                if (answer.result) {
                    console.log("post_data", post_data);
                    console.log(train_byes.trainByLetter(post_data.letter, answer.rows, post_data.user_docs_links));
                }
                resolve({ result: false, message: "Не удалось обучить алгоритм" });
            })


            resolve({ result: false, message: "Не удалось обучить алгоритм." });
        });
    }
}
