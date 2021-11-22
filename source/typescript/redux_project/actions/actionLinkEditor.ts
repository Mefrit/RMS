import { ADD_LINK } from "../types";

export function addLink(link_obj) {
    return {
        type: ADD_LINK,
        payload: link_obj,
    };
}
