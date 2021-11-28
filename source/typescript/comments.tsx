import * as React from "react";
import * as  ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import * as thunk from "redux-thunk";
import { compose, createStore, applyMiddleware } from 'redux';
import { rootReducer } from './redux_project/rootReducer';
import { createLogger } from "redux-logger";
import Comments from "./components/Comments"
import Menu from "./components/Menu"
const thunk_user: any = thunk;
const logger = createLogger();
const store = createStore(rootReducer, compose(
    applyMiddleware(logger, thunk_user)
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
))

function getParams(url) {
    let params = {};

    new URL(url).searchParams.forEach(function (val, key) {
        params[key] = val; // Пушим пары ключ / значение (key / value) в объект
    });

    return params;
}


const root = document.getElementById("root");

ReactDOM.render(<Provider store={store}><div className="container">  <Menu /><Comments params={getParams(window.location)} /> </div></Provider >, root);