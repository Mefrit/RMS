import { SHOW_LOADER, HIDE_LOADER, ADD_LINK, SET_MODE } from "./types";

const initialState = {
    loading: false,
    link_obj: {
        title: "",
        description: "",
        link: "",
        type_resource: "",
    },
    docs_links: [],
};

export const teacherReducer = (state = initialState, action) => {
    // содержится тот контенк, которых мы укажем в обработчикек action.payload
    switch (action.type) {
        case SHOW_LOADER:
            return { ...state, loading: true };
        case ADD_LINK:
            return { ...state, link_obj: action.payload };
        case HIDE_LOADER:
            return { ...state, loading: false };
        case SET_MODE:
            return { ...state, params: action.payload };
        default:
            return state;
    }
};
