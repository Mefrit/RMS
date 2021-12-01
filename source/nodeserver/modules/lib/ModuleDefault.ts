
export class Module_Default {
    db: any;
    db_cis: any;
    constructor(props) {
        this.db = props.db;
    }
    // все актион связанные с БД возвращают Promise?
    runtAction(name_action, data) {

        return this["action" + name_action](data);
    }

    makeRequestCisDB = async (database, sql) => {
        // await ...
        return new Promise((resolve, reject) => {
            database.query(sql, (err, res) => {

                if (err) {
                    resolve({ result: false });
                }
                resolve({ result: true, rows: res.rows });
                database.end()
            })
        });
    };
    makeRequestSqliteDB = async (database, sql) => {
        // await ...
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
    };
}
