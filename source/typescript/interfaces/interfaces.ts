export interface user_message {
    id_organization: number;
    id_question: number;
    num_question: number;
    question: string;
    time_answering: number;
    time_receipt: number;
}
export interface search_params {
    mode: string;
    name_organization: string;
    num_question: number | string;
    time_limit_end: number;
    time_limit_start: number;
}
//
export interface comment_question {
    question: string | number;
    time_receipt: number;
}
export interface user_info_comments {
    name_i: string;
    name_f: string;
    id_user: number;
}
export interface comments_elem {
    comment: string;
    id_comment: number;
    id_user: number;
}
export interface link_obj_teacher {
    title: string;
    description: string;
    link: string;
    type_resource: string;
}
export interface globalState {
    app: {
        loading: boolean;
        alert: boolean;
        messages: user_message[];
        organizations_info: string[];
        on_page: number;
        search_params: search_params;
    };
    comments: {
        comments: comments_elem[];
        loading: boolean;
        question: comment_question;
        user_comment: string;
        users_info: user_info_comments[];
    };
    teacher: {
        docs_links: any[];
        link_obj: link_obj_teacher;
        loading: boolean;
    };
}
