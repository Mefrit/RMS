import { ADD_MESSAGE, SHOW_LOADER, HIDE_LOADER, SET_CACHE_MESSAGE, LOAD_MORE_ELEMENTS } from "../types";

export function addMessage(message) {
    return {
        type: ADD_MESSAGE,
        payload: message,
    };
}
export function setCacheMessages(message) {
    return {
        type: SET_CACHE_MESSAGE,
        payload: message,
    };
}
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
export function loadMoreElements(curent_count) {
    console.log("loadMoreElementsloadMoreElements +++>>>> ", curent_count);
    return {
        type: LOAD_MORE_ELEMENTS,
        payload: curent_count
    };
}
