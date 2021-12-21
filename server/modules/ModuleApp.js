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
exports.Module_App = void 0;
const ModuleDefault_1 = require("./lib/ModuleDefault");
class Module_App extends ModuleDefault_1.Module_Default {
    constructor() {
        super(...arguments);
        this.actionGetList = (post_data) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const database = this.db.getDBSqlite();
                const db_cis = this.db.getDBCis();
                const on_page = post_data.on_page;
                const questions = yield this.makeRequestSqliteDB(database, `SELECT  id_question,question,time_receipt,time_answering,num_question, id_organization FROM questions ORDER BY ${post_data.order} LIMIT ${0}, ${on_page + 6}`);
                let id_organizations = [];
                questions.rows.forEach(elem => {
                    if (id_organizations.indexOf(elem.id_organization) == -1) {
                        id_organizations.push(elem.id_organization);
                    }
                });
                const organizations_db = yield this.makeRequestCisDB(db_cis, `SELECT short_name, id_organization FROM k_organization WHERE id_organization IN (${id_organizations.join(",")}) `);
                if (questions.result && organizations_db.result) {
                    let organzations = this.prepareOrganizations(organizations_db.rows);
                    resolve({ result: true, list: questions.rows, on_page: on_page + 6, organizations: organzations });
                }
                else {
                    resolve({ result: false, list: [], message: questions.message, on_page: on_page + 6, organizations: [] });
                }
            }));
        };
        this.actionGetMessage = (post_data) => {
            return new Promise((resolve, reject) => {
                const database = this.db.getDBSqlite();
                const id_question = post_data.id_question;
                database.serialize(() => {
                    database.all(`SELECT  question FROM questions WHERE id_question=${id_question}`, function (err, rows) {
                        if (err) {
                            resolve({ result: false, message: err.message });
                        }
                        resolve({ result: true, question: rows[0].question });
                    });
                });
            });
        };
    }
    prepareOrganizations(organizations_info) {
        let organzations = {};
        organizations_info.forEach(element => {
            if (element.id_organization && element.short_name) {
                organzations[element.id_organization] = element.short_name;
            }
        });
        return organzations;
    }
}
exports.Module_App = Module_App;

//# sourceMappingURL=../maps/modules/ModuleApp.js.map
