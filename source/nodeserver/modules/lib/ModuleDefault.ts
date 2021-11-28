import { Client } from "pg";

export class Module_Default {
    db_obj: any;
    constructor(props) {
        this.db_obj = props.db_obj;
    }
    async getCisBd() {
        // $dsn = array(
        //     'type' => 'pgsql',
        //     'database' => "db_cis",
        //     'port' => 5432,
        //     'hostspec' => "localhost",
        //     'username' => "cis",
        //     'password' => "cis_passwd",
        //     "phptype" => "pgsql"
        // );
        const client = new Client({
            user: "cis",
            host: "localhost",
            database: "db_cis",
            password: "cis_passwd",
            port: 5432,
        });
        await client.connect();
        const query = "SELECT * FROM users";
        console.log("EHREEEE CISSS!!!!!!!!!!!!!!!!!! ", client);
        client.query(query, (err, res) => {
            if (err) {
                console.error("getCisBd ", err);
                return;
            }
            console.log(" getCisBd ===>>>> Table is successfully created", res);
            client.end();
        });
    }
    // все актион связанные с БД возвращают Promise?
    runtAction(name_action, data) {
        return this["action" + name_action](data);
    }
    makeRequestToDb = async (database, sql) => {
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
