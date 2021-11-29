import { Module_Default } from "./lib/ModuleDefault";
import { Bayes } from "../modules/lib/bayes";
// import console = require("console");
export class Module_Teacher extends Module_Default {
    actionGetDocsList = (post_data: any) => {
        return new Promise((resolve, reject) => {
            console.log("getDocsList");
            const database = this.db.getDBSqlite();
            console.log("post_data ==> ", post_data);
            if (post_data.type_resource == "cms") {
                this.getDocsLinks(database, `SELECT * FROM links`).then((answer: any) => {
                    if (answer.result) {
                        resolve({ result: true, docs_links: answer.rows });
                    }
                    resolve({ result: false, message: "Не удалось загрузить ссылки на документацию" });
                });
            } else {
                resolve({ result: false, message: "Не удалось загрузить ссылки на документацию в CIS." });
            }
        });
    };
    getDocsLinks(database, sql) {
        return new Promise((resolve, reject) => {
            database.serialize(() => {
                database.all(sql, function (err, rows) {
                    if (err) {
                        resolve({ result: false });
                    }
                    resolve({ result: true, rows: rows });
                });
            });
        });
    }
    checkLinks(cache_links, url) {
        let result = false;
        cache_links.forEach((element) => {
            if (element.url == url) {
                result = true;
            }
        });
        return result;
    }
    addNewLink(database, link_obj, id_platform) {
        return new Promise((resolve, reject) => {
            database.serialize(() => {

                database.run('INSERT INTO links(url, title,description) VALUES(?, ?, ?)', [link_obj.link, link_obj.title, link_obj.description], (err, rows) => {
                    if (err) {
                        return resolve({ result: false, message: err.message })
                    }
                    database.all('SELECT MAX(id_link )as id from links', function (err, last_id) {
                        if (err) {
                            resolve({ result: false, message: "Ошибка при добавлении новой ссылки." + err.message });
                        }
                        console.log("last_id", last_id[0].id)
                        database.run('INSERT INTO platforms_links_access(id_link,id_platform) VALUES(?, ?)', [last_id[0].id, id_platform], (err) => {
                            if (err) {
                                return resolve({ result: false, message: "Ошибка при добавлении новой ссылки." + err.message })
                            }
                            console.log('Row was added to the table: ${this.lastID}', id_platform, last_id[0].id);
                            return resolve({ result: true })
                        })
                    });
                })
            });
        });
    }
    actionEditListLinks(post_data) {
        return new Promise((resolve, reject) => {
            const database = this.db.getDBSqlite();
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform = pla.id_platform WHERE  pl.title="${post_data.link_obj.type_resource}" `;
            console.log("query", query)
            this.getDocsLinks(database, query).then((answer: any) => {
                if (answer.result) {
                    console.log("post_data", post_data, this.checkLinks(answer.rows, post_data.link_obj.link));
                    if (!this.checkLinks(answer.rows, post_data.link_obj.link)) {
                        // const sql_insert = "INSERT INTO users(name, age) VALUES(?, ?)";



                        resolve(this.addNewLink(database, post_data.link_obj, post_data.link_obj.type_resource == "cms" ? 1 : 2));
                    } else {
                        resolve({ result: false, message: "Ссылка уже существует в списке" });
                    }

                    // resolve({ result: true, links: train_byes.getRecomendation(post_data.letter, answer.rows) });
                }
                resolve({ result: false, message: "Не удалось изменить список ссылок" });
            });

            //
        });
    }
    actionGetRecomendation(post_data: any) {
        return new Promise((resolve, reject) => {
            console.log("actionGetRecomendation", post_data);
            const train_byes = new Bayes("");
            const database = this.db.getDBSqlite();
            const type_resource = post_data.type_resource;

            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform = pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer: any) => {
                if (answer.result) {
                    console.log("post_data", post_data);

                    resolve({ result: true, links: train_byes.getRecomendation(post_data.letter, answer.rows) });
                }
                resolve({ result: false, message: "Не удалось обучить алгоритм" });
            });
        });
    }
    actionTrain(post_data: any) {
        return new Promise((resolve, reject) => {
            const train_byes = new Bayes("");
            const database = this.db.getDBSqlite();
            const type_resource = post_data.type_resource;
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform =  pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer: any) => {
                if (answer.result) {
                    console.log("post_data", post_data);
                    console.log(train_byes.trainByLetter(post_data.letter, answer.rows, post_data.user_docs_links));
                }
                resolve({ result: false, message: "Не удалось обучить алгоритм" });
            });
            resolve({ result: false, message: "Не удалось обучить алгоритм." });
        });
    }
}
