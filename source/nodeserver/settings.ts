const path2db_sqlite = "./database.db3";
const dsn_cis = {
    user: "cis",
    host: "localhost",
    database: "db_cis",
    password: "cis_passwd",
    port: 5432,
};
const port = 8000;
const base_path = "http://localhost:8000";
const addition_path = "";
const transport_obj = {
    service: "gmail",
    auth: {
        user: "mefrit.1999@gmail.com",
        pass: "56189968",
    },
};
export { transport_obj, dsn_cis, path2db_sqlite, base_path, port, addition_path };
