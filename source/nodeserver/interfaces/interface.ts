export interface cis_connect {
    user: string;
    host: string;
    database: string;
    password: string;
    port: string | number;
}
export interface get_db_connection_answer {
    result: boolean;
    db_cis?: any;
    db_sqlite?: any;
    message?: string;
}
export interface authenticate_answer {
    result: boolean;
    id_user?: number | string;
    message?: string;
}
export interface send_email_answer {
    result: boolean;
    info?: any;
    message?: string;
}
interface default_post_data {
    module: string;
    action: string;
}
export interface teacher_get_docs_list_post extends default_post_data {
    type_resource: string;
}
