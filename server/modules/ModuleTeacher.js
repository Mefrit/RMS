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
                console.log("getDocsList");
                const database = this.db_obj.getDB();
                console.log("post_data ==> ", post_data);
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
    actionEditListLinks(post_data) {
        return new Promise((resolve, reject) => {
            console.log("actionEditListLinks !!!!!!!", post_data);
            resolve({ result: false, message: "Не удалось изменить список ссылок" });
        });
    }
    actionGetRecomendation(post_data) {
        return new Promise((resolve, reject) => {
            console.log("actionGetRecomendation", post_data);
            const train_byes = new bayes_1.Bayes("");
            const database = this.db_obj.getDB();
            const type_resource = post_data.type_resource;
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform = pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer) => {
                if (answer.result) {
                    console.log("post_data", post_data);
                    resolve({ result: true, links: train_byes.getRecomendation(post_data.letter, answer.rows) });
                }
                resolve({ result: false, message: "Не удалось обучить алгоритм" });
            });
        });
    }
    actionTrain(post_data) {
        return new Promise((resolve, reject) => {
            const train_byes = new bayes_1.Bayes("");
            const database = this.db_obj.getDB();
            const type_resource = post_data.type_resource;
            const query = `SELECT l.* FROM links as l JOIN platforms_links_access as pla ON l.id_link = 
            pla.id_link JOIN platforms as pl ON pl.id_platform =  pla.id_platform WHERE  pl.title="${type_resource}" `;
            this.getDocsLinks(database, query).then((answer) => {
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
exports.Module_Teacher = Module_Teacher;

//# sourceMappingURL=../maps/modules/ModuleTeacher.js.map
