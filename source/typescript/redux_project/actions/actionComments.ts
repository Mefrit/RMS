import { SHOW_LOADER, HIDE_LOADER, LOAD_INFO_COMMENTS, UPDATE_COMMENTS } from "../types";

export function showLoaderComments() {
    return {
        type: SHOW_LOADER,
    };
}
export function hideLoaderComments() {
    return {
        type: HIDE_LOADER,
    };
}
export function loadInfoComments(obj) {
    return {
        type: LOAD_INFO_COMMENTS,
        payload: obj
    };
}
export function updateComments(new_comments) {
    return {
        type: UPDATE_COMMENTS,
        payload: new_comments
    };
}
// export function sendMessageToTeacher(message) {
//     return {
//         type: SEND_MESSAGE_TO_TEACHER,
//         payload: message
//     };
// }