
import * as React from "react"
import { useEffect, useState } from "react";
// import List from "./list/List"
import Loader from '../components/loader'

import { connect, useSelector } from 'react-redux'
import { showLoaderComments, hideLoaderComments, loadInfoComments, updateComments } from '../redux_project/actions/actionComments'
import { postJSON } from "../lib/query"
import { getTime } from "lib/module_functions";

// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function Comments(props, dispatchProps) {
    console.log("comments props", props, dispatchProps)
    // let messages_end_element: any = React.createRef();
    const handleDomNodeChange = (domNode: HTMLInputElement | null) => {
        if (domNode) {
            domNode.scrollIntoView({ behavior: "smooth" });
        }
    }
    const [id_question, setIdQuestion] = useState(props.params.id_question);
    const comments = useSelector((state: any): any => state.comments.comments);
    const users_info = useSelector((state: any): any => state.comments.users_info);
    const question = useSelector((state: any): any => state.comments.question);
    // const loading = useSelector((state: any): any => state.comments.loading);
    const [id_user, setIdUser] = useState(props.params.id_user);
    // const [comments, setComments] = useState(props.comments);

    // const [users_info, setUsersInfo] = useState(props.users_info);
    // const [question, setQuestion] = useState(props.question);
    const [user_comment, setUserComment] = useState("");
    const loading = useSelector((state: any): any => state.comments.loading);
    useEffect(() => {
        props.showLoaderComments();

        loadComments(id_question)
        const timer = setInterval(() => {
            // console.log("messages_end_element222222222", messages_end_element)
            loadComments(id_question)
        }, 3000);
        // clearing interval

        return () => clearInterval(timer);

    }, [id_question]);
    const loadComments = async (id_question) => {

        postJSON("/api", {
            id_question: id_question,
            id_user: id_user,
            module: "Comments",
            action: "GetInfoComments"
        }).then((res) => {
            props.hideLoaderComments();
            // console.log("result FORM SERVER Comments WHERE id_question =", res);
            if (res.result) {
                props.loadInfoComments({
                    comments: res.answer.comments,
                    question: res.answer.question,
                    users_info: res.answer.users_info,
                });

            } else {
                alert(res.message);
            }
        });
    };
    const addComment = (ev) => {
        ev.preventDefault();
        let new_comments = [], curent_time = new Date().getUTCDate();
        postJSON("/api", {
            id_question: id_question,
            comment: user_comment,
            id_user: id_user,
            time: curent_time,
            module: "Comments",
            action: "AddComment"
        }).then((res) => {
            props.hideLoaderComments();
            console.log("AddComments=", res);
            if (res.result) {
                new_comments = comments;
                new_comments.push({
                    comment: user_comment,
                    id_comment: res.id_comment,
                    id_user: id_user,
                    time_receipt: curent_time
                });
                props.updateComments(new_comments)
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
        let container_width, li_class = "border-0 list-group-item small p-0 bg-light   mb-0 mt-2 w-100";

        return comments.map(elem => {
            container_width = "border p-2 rounded-3"

            if (elem.comment.length < 20) {
                container_width += " w-25"
            } else {
                if (elem.comment.length > 200) {
                    container_width += " w-75"
                } else {
                    container_width += " w-50"
                }
            }
            return <li className={id_user == elem.id_user ? li_class + " d-flex justify-content-end" : li_class} key={elem.id_comment} >
                <div className={elem.id_user == id_user ? container_width + " bg-primary text-white" : container_width + " bg-white"}>
                    <small className="form-text  w-100  text-info" >{getuserInfoById(users_info, elem.id_user)}</small>
                    <div className="row w-100 mt-1" ><span >{elem.comment}</span></div>
                </div>
            </li >
        })
    }
    function getuserInfoById(users_info, id_curent_user) {
        let name_author = "Unknown";

        users_info.forEach(elem => {

            if (elem.id_user == id_curent_user) {
                name_author = elem.name_i + " " + elem.name_f
            }
        })
        return name_author;
    }
    const scrollToBottom = (messages_end_element) => {
        messages_end_element.scrollIntoView({ behavior: "smooth" });
    }
    return <div className="container  w-75">

        <div className="text-muted d-flex flex-column p-1 w-100  border border-bottom-0  rounded-3 mt-3">
            <div className="  d-flex justify-content-between ">
                <small className="m-3 mt-0 mb-0">Вопрос</small>
                <small>{getTime(new Date(question.time_receipt))}</small>
            </div>
            <p style={{ maxHeight: "300px" }} className=" p-3 w-100  font-weight-light text-danger"> {question.question}</p>
        </div>

        <ul style={{ height: "500px" }} className=" w-100 p-2 list-group  d-flex  bg-light border overflow-auto">
            {renderComments(comments)}
            <div style={{ float: "left", clear: "both" }}
                ref={handleDomNodeChange}>
            </div>
        </ul>
        {id_user ? <div className="w-100"> <textarea onChange={(ev) => { setUserComment(ev.target.value) }} className="form-control mt-3" value={user_comment} ></textarea>
            <input type="button" onClick={addComment} className="btn btn-primary mt-2 mb-5" value="Отправить" /></div> : ""}

    </div>
}
// прокидывания функций в компонент
const mapDispatchToProps = {
    showLoaderComments,
    hideLoaderComments,
    loadInfoComments,
    updateComments
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    loading: false,
    question: state.comments.question,
    user_comment: state.comments.user_comment,

    users_info: state.comments.users_info,
    comments: state.comments.comments,
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(Comments)

// export default connect(mapStateToProps, mapDispatchToProps)(Comments)

