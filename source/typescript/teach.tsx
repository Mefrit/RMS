import * as React from "react";
import * as  ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as thunk from "redux-thunk";
import { compose, createStore, applyMiddleware } from 'redux';
import { rootReducer } from './redux_project/rootReducer';
import { createLogger } from "redux-logger";
import Teacher from "./components/teacher"
import Menu from "./components/Menu"
const thunk_user: any = thunk;
const logger = createLogger();
const store = createStore(rootReducer, compose(
    applyMiddleware(logger, thunk_user)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))




const root = document.getElementById("root");

ReactDOM.render(<Provider store={store}><div className="container">  <Menu /><Teacher /> </div></Provider >, root);