import { SHOW_LOADER, HIDE_LOADER, LOAD_INFO_COMMENTS, UPDATE_COMMENTS } from "./types";

const initialState = {
    loading: false,
    comments: [],
    user_comment: "",
    question: { question: "", time_receipt: 0 },
    users_info: []
};

export const commentsReducer = (state = initialState, action) => {
    // содержится тот контенк, которых мы укажем в обработчикек action.payload
    console.log("commentsReducer => ", action, state);
    switch (action.type) {
        // case ADD_MESSAGE:
        //     return { ...state, messages: state.messages.concat(action.payload) };
        case LOAD_INFO_COMMENTS:
            console.log("LOAD_INFO_COMMENTS in Reducer", action.payload);
            return { ...state, comments: action.payload.comments, users_info: action.payload.users_info, question: action.payload.question };

        case HIDE_LOADER:
            return { ...state, loading: false };
        case UPDATE_COMMENTS:
            return { ...state, commets: action.payload };
        case SHOW_LOADER:
            return { ...state, loading: true };
        default:
            return state;
    }
};
