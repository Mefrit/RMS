import { Module_Default } from "./lib/ModuleDefault";
import { Bayes } from "../modules/lib/bayes";
export class Module_Teacher extends Module_Default {
    actionGetDocsList = (post_data: any) => {
        return new Promise((resolve, reject) => {
            console.log("getDocsList");
            const database = this.db_obj.getDB();
            console.log("post_data ==> ", post_data);
            if (post_data.type_resource == "cms") {
                database.serialize(() => {
                    // FIX ME переделать, клогда будем добавлять ссылки из cis
                    database.all(`SELECT * FROM links`, function (err, rows) {
                        if (err) {
                            resolve({ result: false, message: "Не удалось загрузить ссылки на документацию" });
                        }
                        resolve({ result: true, docs_links: rows });
                    });
                });
            } else {
                resolve({ result: false, message: "Не удалось загрузить ссылки на документацию в CIS." });
            }
        });
    };
    actionTrain(post_data: any) {
        return new Promise((resolve, reject) => {
            const train_byes = new Bayes("");
            train_byes.trainByLetter(post_data.letter, []);
            resolve({ result: false, message: "Не удалось обучить алгоритм." });
        });
    }
}
