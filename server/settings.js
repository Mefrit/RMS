"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addition_path = exports.port = exports.base_path = exports.path2db_sqlite = exports.dsn_cis = exports.transport_obj = exports.path_to_stable_folder = exports.path_to_download = void 0;
const path2db_sqlite = "./server/stable/database.db3";
exports.path2db_sqlite = path2db_sqlite;
const dsn_cis = {
    user: "cis",
    host: "localhost",
    database: "db_cis",
    password: "cis_passwd",
    port: 5432,
};
exports.dsn_cis = dsn_cis;
const port = 8000;
exports.port = port;
const base_path = "http://localhost:8000";
exports.base_path = base_path;
const addition_path = "";
exports.addition_path = addition_path;
const path_to_stable_folder = `/server/stable/`;
exports.path_to_stable_folder = path_to_stable_folder;
const path_to_download = path_to_stable_folder + "download/";
exports.path_to_download = path_to_download;
const transport_obj = {
    service: "gmail",
    auth: {
        user: "mefrit.1999@gmail.com",
        pass: "56189968",
    },
};
exports.transport_obj = transport_obj;

//# sourceMappingURL=maps/settings.js.map
