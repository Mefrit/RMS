"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_Answer = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
class Module_Answer extends ModuleDefault_1.Module_Default {
    actionSetTimeAnswering(post_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const db_sqlite = this.db.getDBSqlite();
                console.log("\n\n\n", post_data, "\n\n\n", `UPDATE question SET time_answering='${post_data.time}' WHERE id_question='${post_data.id_question}'`);
                const answ = yield this.makeRequestSqliteDB(db_sqlite, `UPDATE questions SET time_answering=${post_data.time} WHERE id_question=${post_data.id_question}`);
                if (answ.result) {
                    resolve({ result: true });
                }
                else {
                    resolve({ result: false, message: "письмо отправлено, но не удалось обновить дату отправления сообщения в базе данных." });
                }
            }));
        });
    }
    actionGetQuestion(post_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const db_sqlite = this.db.getDBSqlite();
                const question_answ = yield this.makeRequestSqliteDB(db_sqlite, "SELECT question, time_receipt, type_platform FROM questions WHERE id_question=" + post_data.id_question);
                let question;
                if (question_answ.result) {
                    console.log(question_answ.rows[0]);
                    question = question_answ.rows[0];
                }
                else {
                    question = "Не удалось загрузить вопрос.";
                }
                console.log("!!!!!!!!!!!!!! comments");
                resolve({
                    result: true,
                    answer: question,
                });
            }));
        });
    }
}
exports.Module_Answer = Module_Answer;

//# sourceMappingURL=../maps/modules/ModuleAnswer.js.map
