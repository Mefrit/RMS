import { combineReducers } from "redux";
import { teacherReducer } from "./teacherReducer";
import { appReducer } from "./appReducer";
import { commentsReducer } from "./commentsReducer";
export const rootReducer = combineReducers({
    app: appReducer,
    teacher: teacherReducer,
    comments: commentsReducer
});
