import * as React from "react"
import { connect, useSelector } from 'react-redux'
import { useState, useEffect } from 'react';
import Loader from '../Loader';
import Search from './Search';
import ListElement from './ListElement';
import { loadMoreElements } from '../../redux_project/actions/actionsList'
import { globalState } from "../../interfaces/interfaces"
const List = (props) => {
    let init = false;
    const messages = useSelector((state: globalState) => state.app.messages);
    const search_params = useSelector((state: globalState) => state.app.search_params);
    const loading = useSelector((state: globalState) => state.app.loading);
    const [filter_mode, setFilterListMode] = useState("all");
    const [message_state, setMessagesState] = useState([]);
    const organizations_info = useSelector((state: globalState) => state.app.organizations_info);
    const [reverce, setReverce] = useState(true);
    useEffect(() => {
        if (!init) {
            setMessagesState(messages);
            init = true;
        }
    }, [messages, init, search_params])

    const sortMessages = (type, reverce) => {
        let sort = message_state.sort((elem1, elem2): number => {
            switch (type) {
                case "question":
                    if (elem1[type][0] > elem2[type][0]) {
                        return reverce ? -1 : 1
                    }
                    if (elem1[type][0] < elem2[type][0]) {
                        return reverce ? 1 : -1
                    }
                default:
                    if (elem1[type] < elem2[type]) {
                        return reverce ? -1 : 1
                    }
                    if (elem1[type] > elem2[type]) {
                        return reverce ? 1 : -1
                    }
                    return 0;
            }

        });
        let res = [];
        // FIX ME как то оптимизировать это потом
        sort.forEach((elem, index, arr) => {
            res[index] = elem;
        });
        setReverce(!reverce)
        setMessagesState(res);
    }
    function renderListInterface() {
        return <div className="row bg-light mt-1 p-0 w-100 m-0 ">
            <div className="col-1 "></div>
            <div className=" col-6 text-center"><a href="#" onClick={() => { sortMessages("question", reverce) }} className="btn p-0">Текст обращения</a></div>
            <div className="col-1 text-center"><a href="#" onClick={() => { sortMessages("time_answering", reverce) }} className="btn p-0">Дата ответа </a></div>
            <div className="col-2 text-center"><a href="#" onClick={() => { sortMessages("time_receipt", reverce) }} className="btn p-0">Дата поступления</a></div>
            <div className="col-2 text-center"><a href="#" onClick={() => { sortMessages("id_organization", reverce) }} className="btn p-0">Организация</a></div>
        </div>
    }
    function renderListFilters(filter_mode) {
        return <form className="col-12 d-flex flex-row align-items-center mt-1 w-100">
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
            <Search />
        </form>

    }
    function renderlist(message_state, filter_mode, organizations_info) {
        let add, list = [], tmp;
        for (let i = 0; i < message_state.length; i++) {
            add = true
            if (filter_mode != "all" && message_state[i].time_answering) {
                add = false
            }
            if (add) {
                tmp = { ...message_state[i] };
                if (organizations_info[tmp.id_organization]) {
                    tmp.short_name = organizations_info[tmp.id_organization];
                }
                list.push(<ListElement
                    props={tmp}
                    key={message_state[i].time_answering + "_" + message_state[i].time_receipt + "_" + i}
                />)
            }
        }
        if (list.length < 6) {

            props.loadMoreElements(list.length);
        }
        return list;
    }
    const onScroll = (e) => {

        if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {

            props.loadMoreElements(message_state.length);
        }
    }

    return <div>
        {renderListFilters(filter_mode)}
        {renderListInterface()}
        <ul className="container    w-100 p-0" style={{ maxHeight: "85vh", overflow: "overlay" }} onScroll={onScroll} >

            {loading ? <Loader /> : ""}
            {!message_state.length ? <p className="text-center">Сообщений пока нет</p> : renderlist(message_state, filter_mode, organizations_info)}
            <li className="mb-5"></li>
        </ul>
    </div>
}
const mapDispatchToProps = {
    loadMoreElements
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
