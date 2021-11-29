// import * as React from "react"
// import { Suspense, lazy } from 'react';
// import { useEffect, useState } from "react";
// import List from "./list/List"
// import { loadMessageById } from "../lib/module_functions"
// import { connect } from 'react-redux';
// import { showLoader, hideLoader } from '../redux_project/actions/actionsList'
// import { postJSON } from "../lib/query"
// // REACT.MEME
// // REACT.useCallBack
// // React.useMeme
// // React.lazy
// // React.windows -библиотека
// function Comments(props) {
//     const [letter, setLetter] = useState("");
//     const [comments, setComments] = useState([]);
//     // const [content, setContent] = useState("");
//     // const [messages, setMessages] = useState([]);
//     console.log('props APP', props);
//     // == componentDidMount
//     useEffect(() => {
//         props.showLoader(); 
//         checkParams(props.params);
//         loadComments();

//     }, []);
//     const loadComments = async () => {
//         // postJSON("/?module=App&action=GetList", {
//         //     page: 1,
//         //     on_page: 20,
//         //     order: "time_receipt"
//         // }).then((answer) => {
//         //     props.hideLoader();
//         //     console.log("result FORM SERVER", answer);
//         //     if (answer.result) {
//         //         props.setCacheMessages(answer.list);
//         //     } else {
//         //         alert(answer.message);
//         //     }
//         //     // setContent('');
//         // });
//     }
//     function checkParams(params) {
//         if (params.id_question) {
//             loadMessageById(params.id_question).then((question: string) => {
//                 setLetter(question);
//                 props.hideLoader();
//             })
//         }
//     }
//     return (
//         <div className="container" >
//             <div className="column">
//                 <h1>Comment</h1>
//                 <p>{letter}</p>
//             </div>
//         </div >);

// }
import * as React from "react"
import { useEffect, useState } from "react";
// import List from "./list/List"
import Loader from '../components/loader'

import { connect, useSelector } from 'react-redux'
import { showLoader, hideLoader } from '../redux_project/actions/actionTeacher'
import { postJSON } from "../lib/query"

// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function Comments(props, dispatchProps) {
    console.log("comments Params", props)
    const [id_question, setIdQuestion] = useState(props.params.id_question);
    const [id_user, setIdUser] = useState(props.params.id_user);
    const [comments, setComments] = useState([]);
    const [user_comment, setUserComment] = useState("");
    const [question, setQuestion] = useState("");
    const loading = useSelector((state: any): any => state.teacher.loading);
    useEffect(() => {
        props.showLoader();
        console.log("useEffect", id_question);
        loadComments(id_question)

    }, [id_question]);
    const loadComments = async (id_question) => {

        postJSON("/?module=Comments&action=GetComments", {
            id_question: id_question,
            id_user: id_user
        }).then((res) => {
            props.hideLoader();
            console.log("result FORM SERVER Comments WHERE id_question =", res);
            if (res.result) {
                setComments(res.answer.comments);
                setQuestion(res.answer.question);
            } else {
                alert(res.message);
            }
            // answer.list.fo
            // setContent('');
        });

    };
    const addComment = (ev) => {
        ev.preventDefault();
        postJSON("/?module=Comments&action=AddComments", {
            id_question: id_question,
            comments: comments,
            id_user: id_user
        }).then((res) => {
            props.hideLoader();
            console.log("AddComments=", res);
            if (res.result) {
                // alert()
                console.log("add commetn ", comments);

            } else {
                alert(res.message);
            }

        });
    }
    if (loading) {
        return <Loader />
    }
    function renderComments(comments) {
        const class_cache = " list-group-item small p-2 ms-3 mb-1 rounded-3   w-50 mt-1";
        return comments.map(elem => {
            console.log(elem);
            return <li className={elem.id_user == id_user ? class_cache + " bg-primary text-white " : class_cache + "bg-white"} key={elem.id_comment} > <span>{elem.author} </span> <span>{elem.comment}</span></li >
        })
    }
    return <div className="container  w-75">
        <p className=" bg-light p1 rounded-3 w-75">{question}</p>
        <ul style={{ height: "600px" }} className=" mt-2 w-100 list-group  d-flex justify-content-center bg-light">
            {renderComments(comments)}
        </ul>
        <textarea onChange={(ev) => { setUserComment(ev.target.value) }} className="form-control mt-3" ></textarea>
        <input type="button" onClick={addComment} className="btn btn-primary mt-3" value="Отправить" />
    </div>
}
// прокидывания функций в компонент
const mapDispatchToProps = {
    showLoader, hideLoader
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    loading: false,
    question: state.app.messages
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(Comments)
// // прокидывания функций в компонент
// const mapDispatchToProps = {
//     showLoader, hideLoader
// }
// // инициализация state в компоненте
// const mapStateToProps = state => ({
//     question: state.app.messages,
//     loading: false
// })
// // связка данных and exports
// export default connect(mapStateToProps, mapDispatchToProps)(Comments)

