import { SHOW_LOADER, HIDE_LOADER, LOAD_DOCS } from "../types";

// export function addMessage(message) {
//     return {
//         type: ADD_MESSAGE,
//         payload: message,
//     };
// }
// export function setCacheMessages(message) {
//     return {
//         type: SET_CACHE_MESSAGE,
//         payload: message,
//     };
// }

export function showLoader() {
    return {
        type: SHOW_LOADER,
    };
}
export function hideLoader() {
    return {
        type: HIDE_LOADER,
    };
}
