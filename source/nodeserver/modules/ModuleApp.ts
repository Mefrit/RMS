import { Module_Default } from "./lib/ModuleDefault";
import { createUrlLink2File } from "./lib/functions"
export class Module_App extends Module_Default {
    getSqlSearchObj = (search_url_params: any) => {
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

    actionGetList = (post_data: any) => {
        return new Promise(async (resolve, reject) => {
            const database = this.db.getDBSqlite();
            const db_cis = this.db.getDBCis();
            let sql_search: any = { sqlite_filter: "", cis_filter: "" };
            let organzations = {};

            const on_page = post_data.on_page;
            if (post_data.search_url_params) {
                sql_search = this.getSqlSearchObj(post_data.search_url_params);
            }
            try {
                const sql_sqlite = `SELECT id_question,question,time_receipt,time_answering,num_question, id_organization 
                FROM questions ${sql_search.sqlite_filter} ORDER BY ${post_data.order} LIMIT ${0}, ${on_page + 12}`;

                const questions: any = await this.makeRequestSqliteDB(database, sql_sqlite);
                let id_organizations = [], num_questions = [], files_info: any = [];

                if (questions.result) {
                    questions.rows.forEach((elem) => {
                        if (id_organizations.indexOf(elem.id_organization) == -1) {
                            id_organizations.push(elem.id_organization);
                            num_questions.push(elem.num_question);
                        }
                    });
                    const sql_cis = `SELECT short_name, id_organization FROM k_organization WHERE id_organization IN (${id_organizations.join(",")}) ${sql_search.cis_filter} `;

                    if (id_organizations.length > 0) {
                        const organizations_db: any = await this.makeRequestCisDB(db_cis, sql_cis);
                        if (organizations_db.result) {
                            organzations = this.prepareOrganizations(organizations_db.rows);
                        } else {
                            resolve({
                                result: false,
                                list: [],
                                message:
                                    "Ошибка при загрузке ДБ  " + organizations_db.message,
                                on_page: on_page + 12,
                                organizations: [],
                            });
                        }
                    }
                    if (num_questions.length > 0) {
                        // const organizations_db: any = await this.makeRequestCisDB(db_cis, sql_cis);
                        const sql_sqlite_files = `SELECT name, path, num_question FROM files WHERE num_question IN (${num_questions.join(",")}) `;

                        const files_db: any = await this.makeRequestSqliteDB(database, sql_sqlite_files);
                        if (files_db.result) {
                            files_info = this.prepareFiles(files_db.rows);
                        } else {
                            resolve({
                                result: false,
                                list: [],
                                message:
                                    "Ошибка при загрузке ДБ, файлы.  " + files_db.message,
                                on_page: on_page + 12,
                                organizations: [],
                            });
                        }
                    }

                    const list = this.mergeInformationToList(organzations, files_info, questions.rows);
                    resolve({ result: true, list: list, on_page: on_page + 12, organizations: organzations });
                } else {
                    resolve({
                        result: false,
                        list: [],
                        message:
                            "Ошибка при загрузке ДБ, организации " + questions.message,
                        on_page: on_page + 12,
                        organizations: [],
                    });
                }
            } catch (e) {
                resolve({
                    result: false,
                    list: [],
                    message:
                        "Ошибка при загрузке ДБ  " + e.message,
                    on_page: on_page + 12,
                    organizations: [],
                });
            }

        });
    };
    actionSetQuestionToRms(post_data: any) {
        return new Promise(async (resolve, reject) => {
            const database = this.db.getDBSqlite();
            console.log("post_data set questions ", post_data);
            database.run(
                "INSERT INTO questions(question, id_organization, time_receipt, email_questioner,num_question,type_platform) VALUES(?, ?, ?, ?, ?, ?)",
                [
                    post_data.question,
                    post_data.id_organization,
                    post_data.time_receipt,
                    post_data.email_questioner,
                    post_data.num_question,
                    post_data.type_platform,
                ],
                (err, rows) => {
                    if (err) {
                        return resolve({
                            result: false,
                            message: "Не удалось добавить обращение в систему." + err.message,
                        });
                    }
                    return resolve({ result: true });
                }
            );
        });
    }
    mergeInformationToList(organizations_info, files, list) {

        let result = [], tmp;
        list.forEach((elem) => {
            if (organizations_info[elem.id_organization]) {
                tmp = { ...elem, short_name: organizations_info[elem.id_organization].short_name, files: [] };
                if (files[tmp.num_question]) {
                    tmp.files = files[tmp.num_question];
                }
                result.push(tmp);
            }
        });
        return result;
    }
    prepareFiles(files) {
        let result = {};
        console.log(" !++++++++++++++ > ", files);
        files.forEach((element) => {
            console.log(result[element.num_question]);
            if (!Array.isArray(result[element.num_question])) {
                result[element.num_question] = []
            }

            result[element.num_question].push({ path: createUrlLink2File(element.path), name: element.name });

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
    actionGetMessage = (post_data: any) => {
        return new Promise((resolve, reject) => {
            const database = this.db.getDBSqlite();
            const id_question = post_data.id_question;
            database.serialize(() => {
                database.all(`SELECT  question FROM questions WHERE id_question=${id_question} `, function (err, rows) {
                    if (err) {
                        resolve({ result: false, message: err.message });
                    }
                    resolve({ result: true, question: rows[0].question });
                });
            });
        });
    };
}
