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
            id_question: id_question
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
    if (loading) {
        return <Loader />
    }
    function renderComments(comments) {
        return comments.map(elem => {
            return <li className=" list-group-item small p-2 ms-3 mb-1 rounded-3 bg-white  w-50 " key={elem.id_comment}> <span>{elem.author} </span> <span>{elem.comment}</span></li>
        })
    }
    return <div className="container  w-75">
        <p className=" bg-light p1 rounded-3 w-75">{question}</p>
        <ul style={{ height: "600px" }} className=" mt-2 w-100 list-group  d-flex justify-content-center bg-light">
            {renderComments(comments)}
        </ul>
        <textarea className="form-control mt-3" ></textarea>
        <input type="button" className="btn btn-primary mt-3" value="Отправить" />
    </div>
}
// прокидывания функций в компонент
const mapDispatchToProps = {
    showLoader, hideLoader
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    loading: false,
    type_resource: "cms"
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(Comments)
