import { SHOW_LOADER, HIDE_LOADER } from "./types";

const initialState = {
    loading: false,

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
        // case SET_CACHE_MESSAGE:
        //     console.log("SET_CACHE_MESSAGE", action.payload);
        //     return { ...state, messages: action.payload };
        case HIDE_LOADER:
            return { ...state, loading: false };
        default:
            return state;
    }
};
