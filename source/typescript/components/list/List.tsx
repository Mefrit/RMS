import * as React from "react"
import { connect, useSelector } from 'react-redux'
import { useState, useEffect } from "react";
import Loader from '../Loader'
import ListElement from "./ListElement";
import { loadMoreElements } from '../../redux_project/actions/actionsList'
const List = (props) => {
    const messages = useSelector((state: any): any => state.app.messages);
    let init = false;
    const loading = useSelector((state: any): any => state.app.loading);
    const [filter_mode, setFilterListMode] = useState("all");
    const [message_state, setMessagesState] = useState([]);
    // const [count_elements, setCount] = useState(10);
    const [reverce, setReverce] = useState(true);
    useEffect(() => {
        if (!init) {
            setMessagesState(messages);
            init = true;
        }
    }, [messages, init])

    const sortMessages = (type, reverce) => {
        // let sort = message_state.sort((elem1: any, elem2: any): number => {
        //     switch (type) {
        //         case "question ":
        //             if (elem1[type][0] > elem2[type][0]) {
        //                 return reverce ? -1 : 1
        //             }
        //             if (elem1[type][0] < elem2[type][0]) {
        //                 return reverce ? 1 : -1
        //             }
        //         default:
        //             if (elem1[type] < elem2[type]) {
        //                 return reverce ? -1 : 1
        //             }
        //             if (elem1[type] > elem2[type]) {
        //                 return reverce ? 1 : -1
        //             }
        //             return 0;
        //     }

        // });
        // let res = [];
        // // FIX ME как то оптимизировать это потом
        // sort.forEach((elem, index, arr) => {
        //     res[index] = elem;
        // });
        // setReverce(!reverce)
        // setMessagesState(res);
    }
    function renderListInterface() {
        return <div className="row bg-light mt-1">
            <div className="col-1 "></div>
            <a href="#" onClick={() => { sortMessages("question", reverce) }} className="btn col-7 fw-weight-bolder">Текст обращения</a>
            <a href="#" onClick={() => { sortMessages("time_receipt", reverce) }} className="btn col-2 fw-weight-bolder">Время ответа </a>
            <a href="#" onClick={() => { sortMessages("time_answering", reverce) }} className="btn col-2 fw-weight-bolder">Время поступления</a>
        </div>
    }
    function renderListFilters(filter_mode) {
        return <form className="col-12 d-flex flex-row mt-1 ">
            <div className="form-check ">
                <label className="form-check-label" >
                    <input className="form-check-input" type="radio" onChange={() => { setFilterListMode("all") }} checked={filter_mode == "all"} name="allrequests" />
                    Все письма
                </label>
            </div>
            <div className="form-check m-1 mt-0 mb-0">
                <label className="form-check-label" >
                    <input className="form-check-input" type="radio" onChange={() => { setFilterListMode("withoutanswers") }} checked={filter_mode != "all"} name="withoutanswer" />
                    Письма без ответа
                </label>
            </div>
        </form>

    }
    function renderlist(message_state, filter_mode) {
        let add, list = [];
        for (let i = 0; i < message_state.length; i++) {
            add = true
            if (filter_mode != "all" && message_state[i].time_answering) {
                add = false
            }
            if (add) {
                list.push(<ListElement props={message_state[i]} key={message_state[i].time_answering + "_" + message_state[i].time_receipt + "_" + i} />)
            }
        }
        return list;
    }
    const onScroll = (e) => {
        if (e.target.offsetHeight + e.target.scrollTop === e.target.scrollHeight) {
            //   this.setState(({ items, numShow }) => ({
            //     numShow: Math.min(numShow + 10, items.length),
            //   }));
            props.loadMoreElements(message_state.length);
            console.log("LOADDD BEW ONE ", props);
        }
    }
    // if (loading) {
    //     return <Loader />
    if (!message_state.length) {
        return <p className="text-center">Сообщений пока нет</p>
    }

    return <div>
        {renderListFilters(filter_mode)}
        {renderListInterface()}
        <ul className="col-sm list-group container   overflow-auto" style={{ maxHeight: "85vh" }} onScroll={onScroll} >

            {loading ? <Loader /> : ""}
            {renderlist(message_state, filter_mode)}
            <li className="mb-5"></li>
        </ul>
    </div>
}
const mapDispatchToProps = {
    loadMoreElements
    // hideLoaderComments,
    // loadInfoComments,
    // updateComments
}
const mapStateToProps = state => {
    // установка начальных значений
    return {
        messages: state.app.messages,
        loading: false
    }
}
// проброска первоначальных state в компонент
export default connect(mapStateToProps, mapDispatchToProps)(List)
