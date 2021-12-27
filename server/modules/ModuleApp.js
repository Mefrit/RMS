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
        this.getSqlSearchObj = (search_url_params) => {
            let result = { sqlite_filter: "", cis_filter: "" };
            switch (search_url_params.search_mode) {
                case "organizations":
                    if (search_url_params.search_str != "")
                        result.cis_filter = ` AND  lower(short_name) LIKE '%${search_url_params.search_str.toLowerCase()}%'`;
                    break;
                case "num_question":
                    if (search_url_params.search_str != "")
                        result.sqlite_filter = ` WHERE num_question LIKE '${search_url_params.search_str}%'`;
                    break;
                case "time_receipt":
                    if (search_url_params.time_end) {
                        result.sqlite_filter = ` WHERE time_receipt < ${search_url_params.time_end}`;
                        if (search_url_params.time_start) {
                            result.sqlite_filter += ` AND time_receipt > ${search_url_params.time_start}`;
                        }
                    }
                    break;
            }
            return result;
        };
        this.actionGetList = (post_data) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const database = this.db.getDBSqlite();
                const db_cis = this.db.getDBCis();
                let sql_search = { sqlite_filter: "", cis_filter: "" };
                const on_page = post_data.on_page;
                if (post_data.search_url_params) {
                    sql_search = this.getSqlSearchObj(post_data.search_url_params);
                }
                const sql_sqlite = `SELECT id_question,question,time_receipt,time_answering,num_question, id_organization FROM questions ${sql_search.sqlite_filter} ORDER BY ${post_data.order} LIMIT ${0}, ${on_page + 12}`;
                const questions = yield this.makeRequestSqliteDB(database, sql_sqlite);
                let id_organizations = [];
                questions.rows.forEach((elem) => {
                    if (id_organizations.indexOf(elem.id_organization) == -1) {
                        id_organizations.push(elem.id_organization);
                    }
                });
                const sql_cis = `SELECT short_name, id_organization FROM k_organization WHERE id_organization IN (${id_organizations.join(",")} ) ${sql_search.cis_filter} `;
                const organizations_db = yield this.makeRequestCisDB(db_cis, sql_cis);
                console.log("organizations_db", organizations_db);
                if (questions.result && organizations_db.result) {
                    const organzations = this.prepareOrganizations(organizations_db.rows);
                    const list = this.mergeOrganizationsToList(organzations, questions.rows);
                    resolve({ result: true, list: list, on_page: on_page + 12, organizations: organzations });
                }
                else {
                    resolve({
                        result: false,
                        list: [],
                        message: "Ошибка при загрузке ДБ  " + questions.message ? questions.message : organizations_db.message,
                        on_page: on_page + 12,
                        organizations: [],
                    });
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
    actionSetQuestionToRms(post_data) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const database = this.db.getDBSqlite();
            console.log("post_data set questions ", post_data);
            database.run("INSERT INTO questions(question, id_organization, time_receipt, email_questioner,num_question,type_platform) VALUES(?, ?, ?, ?, ?, ?)", [
                post_data.question,
                post_data.id_organization,
                post_data.time_receipt,
                post_data.email_questioner,
                post_data.num_question,
                post_data.type_platform,
            ], (err, rows) => {
                if (err) {
                    return resolve({
                        result: false,
                        message: "Не удалось добавить обращение в систему." + err.message,
                    });
                }
                return resolve({ result: true });
            });
        }));
    }
    mergeOrganizationsToList(organizations_info, list) {
        let result = [];
        list.forEach((elem) => {
            if (organizations_info[elem.id_organization])
                result.push(Object.assign(Object.assign({}, elem), { short_name: organizations_info[elem.id_organization].short_name }));
        });
        return result;
    }
    prepareOrganizations(organizations_info) {
        let organzations = {};
        organizations_info.forEach((element) => {
            if (element.id_organization && element.short_name) {
                organzations[element.id_organization] = element.short_name;
            }
        });
        return organzations;
    }
}
exports.Module_App = Module_App;

//# sourceMappingURL=../maps/modules/ModuleApp.js.map
