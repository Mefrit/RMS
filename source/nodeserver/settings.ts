const path2db_sqlite = "./server/stable/database.db3";
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
const path_to_stable_folder = `/server/stable/`
const path_to_download = path_to_stable_folder + "download/";
const transport_obj = {
    service: "gmail",
    auth: {
        user: "mefrit.1999@gmail.com",
        pass: "56189968",
    },
};
export { checkDirб path_to_download, path_to_stable_folder, transport_obj, dsn_cis, path2db_sqlite, base_path, port, addition_path };
