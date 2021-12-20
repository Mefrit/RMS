import { ADD_MESSAGE, SHOW_LOADER, HIDE_LOADER, SET_CACHE_MESSAGE, LOAD_MORE_ELEMENTS } from "./types";

const initialState = {
    loading: false,
    alert: null,
    messages: [],
    on_page: 0
};

export const appReducer = (state = initialState, action) => {
    // содержится тот контенк, которых мы укажем в обработчикек action.payload

    switch (action.type) {
        case ADD_MESSAGE:
            return { ...state, messages: state.messages.concat(action.payload) };
        case SHOW_LOADER:
            return { ...state, loading: true };
        case SET_CACHE_MESSAGE:

            return { ...state, messages: action.payload };
        case HIDE_LOADER:
            return { ...state, loading: false };
        case LOAD_MORE_ELEMENTS:
            console.log("LOAD_MORE_ELEMENTS", state, action.payload);
            return { ...state, on_page: action.payload };
        default:
            return state;
    }
};
