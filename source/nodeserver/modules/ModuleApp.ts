import { Module_Default } from "./lib/ModuleDefault";

export class Module_App extends Module_Default {
    actionGetList = (post_data: any) => {
        return new Promise(async (resolve, reject) => {
            const database = this.db.getDBSqlite();
            const db_cis = this.db.getDBCis();
            // const numb_record_start = (post_data.page - 1) * post_data.on_page;
            const on_page = post_data.on_page;
            // database.serialize(() => {
            //     database.all(
            //         `SELECT  id_question,question,time_receipt,time_answering,num_question FROM questions ORDER BY ${post_data.order} LIMIT ${0}, ${on_page + 6}`,
            //         function (err, rows) {
            //             if (err) {
            //                 resolve({ result: false, list: [], message: err.message, on_page: on_page + 6 });
            //             }
            //             resolve({ result: true, list: rows });
            //         }
            //     );
            // });
            const questions: any = await this.makeRequestSqliteDB(
                database,
                `SELECT  id_question,question,time_receipt,time_answering,num_question, id_organization FROM questions ORDER BY ${post_data.order} LIMIT ${0}, ${on_page + 6}`
            );
            let id_organizations = [];
            questions.rows.forEach(elem => {
                if (id_organizations.indexOf(elem.id_organization) == -1) {
                    id_organizations.push(elem.id_organization)
                }
            })
            // console.log(id_organizations.join(","));
            const organizations_db: any = await this.makeRequestCisDB(
                db_cis,
                `SELECT short_name, id_organization FROM k_organization WHERE id_organization IN (${id_organizations.join(",")}) `
            );

            // console.log(organizations);

            if (questions.result && organizations_db.result) {
                let organzations = this.prepareOrganizations(organizations_db.rows);
                resolve({ result: true, list: questions.rows, on_page: on_page + 6, organizations: organzations });
            } else {
                resolve({ result: false, list: [], message: questions.message, on_page: on_page + 6, organizations: [] });
            }
        });
    };
    prepareOrganizations(organizations_info) {
        let organzations = {};
        organizations_info.forEach(element => {

            if (element.id_organization && element.short_name) {
                organzations[element.id_organization] = element.short_name
            }

        });
        return organzations;
    }
    actionGetMessage = (post_data: any) => {
        return new Promise((resolve, reject) => {
            const database = this.db.getDBSqlite();
            const id_question = post_data.id_question;
            database.serialize(() => {
                database.all(
                    `SELECT  question FROM questions WHERE id_question=${id_question}`, function (err, rows) {
                        if (err) {
                            resolve({ result: false, message: err.message });
                        }
                        resolve({ result: true, question: rows[0].question });
                    }
                );

            });
        });
    };
}
