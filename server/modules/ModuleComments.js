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
    actionGetComments(post_data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const db_sqlite = this.db.getDBSqlite();
                const db_cis = this.db.getDBCis();
                console.log("post_data comments", post_data);
                const comments = yield this.makeRequestSqliteDB(db_sqlite, "SELECT comment, id_comment, id_user FROM Comments WHERE id_question=" + post_data.id_question);
                const question = "";
                if (comments.result) {
                    resolve({ result: true, answer: { comments: comments.rows, question: question } });
                }
                resolve({ result: false, message: "Не удалось загрузить комментарии к вопросу." });
            }));
        });
    }
}
exports.Module_Comments = Module_Comments;

//# sourceMappingURL=../maps/modules/ModuleComments.js.map
