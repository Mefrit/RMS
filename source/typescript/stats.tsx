import * as React from "react";
import * as  ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as thunk from "redux-thunk";
import { compose, createStore, applyMiddleware } from 'redux';
import { rootReducer } from './redux_project/rootReducer';
import { createLogger } from "redux-logger";
import Stats from "./components/Stats"
import Menu from "./components/Menu"
import { getParams } from "lib/module_functions";
const thunk_user: any = thunk;
const logger = createLogger();
const store = createStore(rootReducer, compose(
    applyMiddleware(logger, thunk_user)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))



const root = document.getElementById("root");
const answers_params = getParams(window.location);
console.log("answers_params!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");
ReactDOM.render(<Provider store={store}><div className="container">  <Menu /> <Stats params={answers_params} /> </div></Provider >, root);