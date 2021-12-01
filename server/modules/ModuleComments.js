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
exports.Module_Comments = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
class Module_Comments extends ModuleDefault_1.Module_Default {
    actionAddComment(post_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                console.log("add Comment", post_data);
                const database = this.db.getDBSqlite();
                database.serialize(() => {
                    database.run('INSERT INTO comments(id_user, comment, time_receipt, id_question) VALUES(?, ?, ?, ?)', [post_data.id_user, post_data.comment, post_data.time_receipt, post_data.id_question], (err, rows) => {
                        if (err) {
                            return resolve({ result: false, message: "Не удалось добавить комментарий." + err.message });
                        }
                        database.all('SELECT MAX(id_comment ) as id from comments', function (err, last_id) {
                            if (err) {
                                return resolve({ result: false, message: "Не удалось добавить комментарий." + err.message });
                            }
                            return resolve({ result: true, id_comment: last_id[0].id });
                        });
                    });
                });
            }));
        });
    }
    actionGetInfoComments(post_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const db_sqlite = this.db.getDBSqlite();
                const db_cis = this.db.getDBCis();
                console.log("post_data comments", post_data);
                const question_answ = yield this.makeRequestSqliteDB(db_sqlite, "SELECT question, time_receipt FROM questions WHERE id_question=" + post_data.id_question);
                let question;
                if (question_answ.result) {
                    question = question_answ.rows[0];
                }
                else {
                    question = "Не удалось загрузить вопрос.";
                }
                const comments_answ = yield this.makeRequestSqliteDB(db_sqlite, "SELECT comment, id_comment, id_user FROM Comments WHERE id_question=" + post_data.id_question);
                let cache_id_users = [], comments, users_info;
                if (comments_answ.result) {
                    comments = comments_answ.rows;
                    comments_answ.rows.forEach((comment) => {
                        if (cache_id_users.indexOf(comment.id_user) == -1) {
                            cache_id_users.push(comment.id_user);
                        }
                    });
                    const users_info_answ = yield this.makeRequestCisDB(db_cis, "SELECT name_i, name_f,id_user FROM users WHERE id_user IN (" + cache_id_users.join(",") + ")");
                    if (users_info_answ.result) {
                        users_info = users_info_answ.rows;
                    }
                    else {
                        comments = [];
                    }
                }
                else {
                    resolve({ result: false, message: "Не удалось загрузить комментарии к вопросу." });
                }
                console.log("!!!!!!!!!!!!!! comments", cache_id_users);
                resolve({
                    result: true,
                    answer: { comments: comments, question: question, users_info: users_info },
                });
            }));
        });
    }
}
exports.Module_Comments = Module_Comments;

//# sourceMappingURL=../maps/modules/ModuleComments.js.map
