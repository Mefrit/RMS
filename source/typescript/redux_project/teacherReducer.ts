import { SHOW_LOADER, HIDE_LOADER, ADD_LINK } from "./types";

const initialState = {
    loading: false,
    link_obj: {
        title: '',
        description: '',
        link: '',
        type_resource: ''
    },
    docs_links: [],
};

export const teacherReducer = (state = initialState, action) => {
    // содержится тот контенк, которых мы укажем в обработчикек action.payload
    console.log("teacherReducer => ", action, state);
    switch (action.type) {
        // case ADD_MESSAGE:
        //     return { ...state, messages: state.messages.concat(action.payload) };
        case SHOW_LOADER:
            return { ...state, loading: true };
        case ADD_LINK:
            console.log("ADD_LINK in Reducer", action.payload);
            return { ...state, link_obj: action.payload };
        case HIDE_LOADER:
            return { ...state, loading: false };
        default:
            return state;
    }
};
