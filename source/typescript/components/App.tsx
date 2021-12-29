import * as React from "react"
import { useEffect } from "react";
import List from "./list/List"

import { connect, useSelector } from 'react-redux';
import { addMessage, showLoader, hideLoader, setCacheMessages, setOrganizationInfo } from '../redux_project/actions/actionsList'
import { postJSON } from "../lib/query"
import { globalState, search_params } from "../interfaces/interfaces";
// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function App(props, dispatchProps) {

    const on_page = useSelector((state: globalState) => state.app.on_page);
    const search_params = useSelector((state: globalState) => state.app.search_params);
    // const [messages, setMessages] = useState([]);
    // == componentDidMount
    const getUrlSearchParams = (search_params: search_params) => {
        const start_params = { search_mode: search_params.mode };
        switch (search_params.mode) {
            case "time_receipt":
                return { ...start_params, time_start: search_params.time_limit_start, time_end: search_params.time_limit_end };
            case "num_question":
                return { ...start_params, search_str: search_params.num_question };
            case "organizations":
                return { ...start_params, search_str: search_params.name_organization };
        }
    }
    const buildUrlParamsGetList = (on_page, search_params) => {
        let search_url_params = {}
        const default_params = {
            on_page: on_page,
            order: "time_receipt DESC",
            module: "App",
            action: "GetList"
        };

        if (search_params.mode != "") {
            search_url_params = getUrlSearchParams(search_params)
        }
        return { ...default_params, search_url_params };
    }
    const fetchData = async (url_params) => {

        postJSON("/api", url_params).then((answer) => {
            props.hideLoader();
            if (answer.result) {
                if (answer.list.length != on_page) {
                    props.setCacheMessages(answer.list);
                    props.setOrganizationInfo(answer.organizations);
                }

            } else {
                alert(answer.message);
            }
        });
    };
    useEffect(() => {
        props.showLoader();

        const url_params = buildUrlParamsGetList(on_page, search_params);
        fetchData(url_params);
        const timer = setInterval(() => {

            fetchData(url_params);
        }, 60000);
        return () => clearInterval(timer);
    }, [on_page, search_params]);

    return (
        <div className="container" >
            <List loadMoreElements={props.loadMoreElements} />
        </div >);
}
// прокидывания функций в компонент
const mapDispatchToProps = {
    addMessage,
    showLoader,
    hideLoader,
    setCacheMessages,
    setOrganizationInfo
}
// инициализация state в компоненте
const mapStateToProps = state => ({
    messages: state.app.messages,
    loading: false,
    on_page: state.app.on_page
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(App)