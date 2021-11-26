import * as React from "react"
import { Suspense, lazy } from 'react';
import { useEffect, useState } from "react";
import List from "./list/List"
import { loadMessageById } from "../lib/module_functions"
import { connect } from 'react-redux';
import { showLoader, hideLoader } from '../redux_project/actions/actionsList'
import { postJSON } from "../lib/query"
// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function Comments(props) {
    const [letter, setLetter] = useState("");
    const [comments, setComments] = useState([]);
    // const [content, setContent] = useState("");
    // const [messages, setMessages] = useState([]);
    console.log('props APP', props);
    // == componentDidMount
    useEffect(() => {
        props.showLoader();
        checkParams(props.params)
        loadComments();
        // const fetchData = async () => {
        //     postJSON("/?module=App&action=GetList", {
        //         page: 1,
        //         on_page: 20,
        //         order: "time_receipt"
        //     }).then((answer) => {
        //         props.hideLoader();
        //         console.log("result FORM SERVER", answer);
        //         if (answer.result) {
        //             props.setCacheMessages(answer.list);
        //         } else {
        //             alert(answer.message);
        //         }
        //         // setContent('');
        //     });

        // };
        // fetchData();
    }, []);
    const loadComments = async () => {
        // postJSON("/?module=App&action=GetList", {
        //     page: 1,
        //     on_page: 20,
        //     order: "time_receipt"
        // }).then((answer) => {
        //     props.hideLoader();
        //     console.log("result FORM SERVER", answer);
        //     if (answer.result) {
        //         props.setCacheMessages(answer.list);
        //     } else {
        //         alert(answer.message);
        //     }
        //     // setContent('');
        // });
    }
    function checkParams(params) {
        if (params.id_question) {
            loadMessageById(params.id_question).then((question: string) => {
                setLetter(question);
                props.hideLoader();
            })
        }
    }
    return (
        <div className="container" >
            <div className="column">
                <h1>Comment</h1>
                <p>{letter}</p>
            </div>
        </div >);

}
// прокидывания функций в компонент
const mapDispatchToProps = {
    showLoader, hideLoader
}
// инициализация state в компоненте
const mapStateToProps = state => ({
    question: state.app.messages,
    loading: false
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(Comments)

