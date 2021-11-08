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
                    database.serialize(() => {
                        database.all(`SELECT * FROM links`, function (err, rows) {
                            if (err) {
                                resolve({ result: false, message: "Не удалось загрузить ссылки на документацию" });
                            }
                            resolve({ result: true, docs_links: rows });
                        });
                    });
                }
                else {
                    resolve({ result: false, message: "Не удалось загрузить ссылки на документацию в CIS." });
                }
            });
        };
    }
    actionTrain(post_data) {
        return new Promise((resolve, reject) => {
            const train_byes = new bayes_1.Bayes("");
            train_byes.trainByLetter(post_data.letter, []);
            resolve({ result: false, message: "Не удалось обучить алгоритм." });
        });
    }
}
exports.Module_Teacher = Module_Teacher;

//# sourceMappingURL=../maps/modules/ModuleTeacher.js.map
