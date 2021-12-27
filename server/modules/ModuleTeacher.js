"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_Teacher = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
const bayes_1 = require("../modules/lib/bayes");
class Module_Teacher extends ModuleDefault_1.Module_Default {
    constructor() {
        super(...arguments);
        this.actionGetDocsList = (post_data) => {
            return new Promise((resolve, reject) => {
                const database = this.db.getDBSqlite();
                if (post_data.type_resource == "cms") {
                    this.getDocsLinks(database, `SELECT * FROM links`).then((answer) => {
                        if (answer.result) {
                            resolve({ result: true, docs_links: answer.rows });
                        }
                        resolve({ result: false, message: "Не удалось загрузить ссылки на документацию" });
                    });
                }
                else {
                    resolve({ result: false, message: "Не удалось загрузить ссылки на документацию в CIS." });
                }
            });
        };
    }
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
                database.run("INSERT INTO links(url, title,description) VALUES(?, ?, ?)", [link_obj.link, link_obj.title, link_obj.description], (err, rows) => {
                    if (err) {
                        return resolve({ result: false, message: err.message });
                    }
                    database.all("SELECT MAX(id_link )as id from links", function (err, last_id) {
                        if (err) {
                            resolve({
                                result: false,
                                message: "Ошибка при добавлении новой ссылки." + err.message,
                            });
                        }
                        database.run("INSERT INTO platforms_links_access(id_link,id_platform) VALUES(?, ?)", [last_id[0].id, id_platform], (err) => {
                            if (err) {
                                return resolve({
                                    result: false,
                                    message: "Ошибка при добавлении новой ссылки." + err.message,
                                });
                            }
                            return resolve({ result: true });
                        });
                    });
                });
            });
        });
    }
    actionEditListLinks(post_data) {
        return new Promise((resolve, reject) => {
            const database = this.db.getDBSqlite();
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform = pla.id_platform WHERE  pl.title="${post_data.link_obj.type_resource}" `;
            this.getDocsLinks(database, query).then((answer) => {
                if (answer.result) {
                    if (!this.checkLinks(answer.rows, post_data.link_obj.link)) {
                        resolve(this.addNewLink(database, post_data.link_obj, post_data.link_obj.type_resource == "cms" ? 1 : 2));
                    }
                    else {
                        resolve({ result: false, message: "Ссылка уже существует в списке" });
                    }
                }
                resolve({ result: false, message: "Не удалось изменить список ссылок" });
            });
        });
    }
    actionGetRecomendation(post_data) {
        return new Promise((resolve, reject) => {
            const train_byes = new bayes_1.Bayes("");
            const database = this.db.getDBSqlite();
            const type_resource = post_data.type_resource;
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform = pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer) => {
                if (answer.result) {
                    resolve({ result: true, links: train_byes.getRecomendation(post_data.letter, answer.rows) });
                }
                resolve({ result: false, message: "Не удалось получить рекомендации." });
            });
        });
    }
    actionTrain(post_data) {
        return new Promise((resolve, reject) => {
            const train_byes = new bayes_1.Bayes("");
            const database = this.db.getDBSqlite();
            const type_resource = post_data.type_resource;
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform =  pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer) => {
                if (answer.result) {
                    train_byes.trainByLetter(post_data.letter, answer.rows, post_data.user_docs_links);
                }
                resolve({ result: true, message: "Алгоритм успешно переобучен." });
            });
            resolve({ result: false, message: "Не удалось обучить алгоритм." });
        });
    }
}
exports.Module_Teacher = Module_Teacher;

//# sourceMappingURL=../maps/modules/ModuleTeacher.js.map
