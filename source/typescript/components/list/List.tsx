import * as React from "react"
import { connect, useSelector } from 'react-redux'
import { useState, useEffect } from "react";
import Loader from '../loader'
import ListElement from "./listElement";
import { setCacheMessages } from '../../redux_project/actions/actionsList'
{/* <label >
Сортировать по
<select name="" id="">
    <option value="">Поступления обращения</option>
    <option value="">Дата, ответа на обращение</option>
</select>
</label> */}
//fix me Props interface
const List = (props) => {
    const messages = useSelector((state: any): any => state.app.messages);
    let init = false;
    const loading = useSelector((state: any): any => state.app.loading);
    let reverce;
    if (reverce === undefined) {
        reverce = false
    }
    const [message_state, setMessagesState] = useState([]);

    useEffect(() => {
        if (!init) {
            reverce = false;
            setMessagesState(messages);
            init = true;
            console.log("HEREEEEEEEE");
        }

    }, [messages, init])

    function sortMessages(type, reverce) {
        console.log(type, message_state);

        let sort = message_state.sort((elem1: any, elem2: any): number => {
            if (elem1[type] < elem2[type]) {
                return reverce ? -1 : 1
            }
            if (elem1[type] > elem2[type]) {
                return reverce ? 1 : -1
            }
            return 0;
        })
        console.log("reverce", reverce);
        reverce = !reverce;
        props.setCacheMessages(sort);
        // setMessagesState(sort); 
    }
    function renderlistInterface() {
        return <li className="row bg-light mt-1">
            <div className="col-1 "></div>
            <a href="#" onClick={() => { sortMessages("question", reverce) }} className="btn col-7 fw-weight-bolder">Текст обращения</a>
            <a href="#" onClick={() => { sortMessages("time_receipt", reverce) }} className="btn col-2 fw-weight-bolder">Время ответа </a>
            <a href="#" onClick={() => { sortMessages("time_answering", reverce) }} className="btn col-2 fw-weight-bolder">Время поступления</a>
        </li>
    }
    if (loading) {
        return <Loader />
    } else
        if (!message_state.length) {
            return <p className="text-center">Сообщений пока нет</p>
        }
    console.log("props ", props);
    return <ul className="col-sm list-group container" >{renderlistInterface()} {message_state.map((message, index, arr) => { console.log("message 11111==>>> ", message.time_receipt + "_" + index, message, index); return <ListElement message={message} key={message.time_receipt + "_" + index} /> })}</ul>
}

const mapStateToProps = state => {
    // установка начальных значений
    return {
        messages: state.app.messages,

        loading: false
    }
}
const mapDispatchToProps = {
    setCacheMessages
}
// проброска первоначальных state в компонент
export default connect(mapStateToProps, mapDispatchToProps)(List)
