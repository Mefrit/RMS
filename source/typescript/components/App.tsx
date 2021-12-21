import * as React from "react"
import { useEffect, useState } from "react";
import List from "./list/List"

import { connect, useSelector } from 'react-redux';
import { addMessage, showLoader, hideLoader, setCacheMessages, setOrganizationInfo } from '../redux_project/actions/actionsList'
import { postJSON } from "../lib/query"
// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function App(props, dispatchProps) {

    const on_page = useSelector((state: any): any => state.app.on_page);
    // const [messages, setMessages] = useState([]);
    // == componentDidMount
    useEffect(() => {
        props.showLoader();
        console.log("Here useEffect App", props, on_page);
        const fetchData = async () => {
            postJSON("/api", {
                on_page: on_page,
                order: "time_receipt",
                module: "App",
                action: "GetList"
            }).then((answer) => {
                props.hideLoader();
                if (answer.result) {
                    console.log("answer result server", answer)
                    props.setCacheMessages(answer.list);
                    props.setOrganizationInfo(answer.organizations);
                } else {
                    alert(answer.message);
                }
            });
        };
        fetchData();
    }, [on_page]);

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