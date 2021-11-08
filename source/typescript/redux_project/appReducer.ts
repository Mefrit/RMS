import { ADD_MESSAGE, SHOW_LOADER, HIDE_LOADER, SET_CACHE_MESSAGE } from "./types";

const initialState = {
    loading: false,
    alert: null,
    messages: [],
};

export const appReducer = (state = initialState, action) => {
    // содержится тот контенк, которых мы укажем в обработчикек action.payload

    switch (action.type) {
        case ADD_MESSAGE:
            return { ...state, messages: state.messages.concat(action.payload) };
        case SHOW_LOADER:
            return { ...state, loading: true };
        case SET_CACHE_MESSAGE:
            console.log("SET_CACHE_MESSAGE", action.payload);
            return { ...state, messages: action.payload };
        case HIDE_LOADER:
            return { ...state, loading: false };
        default:
            return state;
    }
};
