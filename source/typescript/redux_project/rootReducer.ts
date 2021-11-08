import { combineReducers } from "redux";
import { teacherReducer } from "./teacherReducer";
import { appReducer } from "./appReducer";
export const rootReducer = combineReducers({
    app: appReducer,
    teacher: teacherReducer,
});
