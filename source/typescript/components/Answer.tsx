import { postJSON } from "../lib/query"
import { connect, useSelector } from 'react-redux'
import { useEffect, useState } from "react";

import { showLoaderAnswer, hideLoaderAnswer } from '../redux_project/actions/actionAnswer'
import * as React from "react"
import Loader from '../components/loader'
function Answer(props, dispatchProps) {
    const loading = useSelector((state: any): any => state.comments.loading);
    const [id_question, setIdQuestion] = useState(props.params.id_question);
    // const question = useSelector((state: any): any => state.comments.question);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    console.log("props", props);
    useEffect(() => {
        props.showLoaderAnswer();

        loadQuestion(id_question)
        // const timer = setInterval(() => {
        // console.log("messages_end_element222222222", messages_end_element)
        // loadQuestion(id_question)
        // }, 3000);
        // clearing interval
        // return () => clearInterval(timer);
    }, [id_question]);
    const loadQuestion = async (id_question) => {

        postJSON("/api", {
            id_question: id_question,
            module: "Answer",
            action: "GetQuestion"
        }).then((res) => {
            props.hideLoaderAnswer();

            if (res.result) {
                console.log("res.result answer", res);
                setQuestion(res.answer.question)
                // props.loadInfoComments({
                //     comments: res.answer.comments,
                //     question: res.answer.question,
                //     users_info: res.answer.users_info,
                // });
                // if (res.answer.id_user && id_user === undefined) {
                //     setIdUser(res.answer.id_user);
                //     console.log("result FORM SERVER Comments WHERE id_question =", res, id_user);
                // }
            } else {
                alert(res.message);
            }
        });
    };
    // const send = () => {
    //     console.log(answer);
    //     postJSON("/api", {
    //         id_question: id_question,
    //         answer: answer,
    //         module: "Answer",
    //         action: "SentAnswer"

    //     }).then((res) => {
    //         props.hideLoaderAnswer();
    //         if (res.result) {
    //             console.log("res.result sentAnswer", res);
    //             // setQuestion(res.answer.question)
    //             // props.loadInfoComments({
    //             //     comments: res.answer.comments,
    //             //     question: res.answer.question,
    //             //     users_info: res.answer.users_info,
    //             // });
    //             // if (res.answer.id_user && id_user === undefined) {
    //             //     setIdUser(res.answer.id_user);
    //             //     console.log("result FORM SERVER Comments WHERE id_question =", res, id_user);
    //             // }
    //         } else {
    //             alert(res.message);
    //         }
    //     });
    // }


    if (loading) {
        return <Loader />
    }
    return <form className="container  w-75" method="post" encType="multipart/form-data" action="/send" >
        {props.params.message ? <p className="w-100 text-danger">{props.params.message}</p> : ""}
        <p className="w-100">{question}</p>
        <div className="input-group mb-1">
            <div className="input-group-prepend col-1">
                <span className="input-group-text" id="basic-addon1">От кого</span>
            </div>
            <input type="email" name="address2sender" className="form-control" aria-describedby="basic-addon1" />
        </div>
        <div className="input-group mb-1">
            <div className="input-group-prepend col-1">
                <span className="input-group-text" id="basic-addon1">Кому</span>
            </div>
            <input type="email" name="address2send" className="form-control" aria-describedby="basic-addon1" />
        </div>
        <div className="input-group mb-2">
            <div className="input-group-prepend col-1">
                <span className="input-group-text" id="basic-addon1">Тема</span>
            </div>
            <input type="text" name="subject" className="form-control" aria-describedby="basic-addon1" />
        </div>
        <div className="form-group  mb-2">
            <label >Прикрепить файл
                <input type="file" className="form-control-file" name="file_uploaded" multiple />
            </label>
        </div>
        <input type="hidden" name="id_question" value={id_question} />
        <textarea name="content" className="w-100 form-control" onChange={(ev) => { setAnswer(ev.target.value) }} value={answer} cols={30} rows={10}></textarea>
        <div className="row justify-content-md-center mt-3">
            <input type="submit" onClick={() => {
                console.log("click")
            }} className="col-5 btn btn-primary" value="Отправить" />
        </div>
    </form>
}
const mapDispatchToProps = {
    showLoaderAnswer,
    hideLoaderAnswer
    // hideLoaderComments,
    // loadInfoComments,
    // updateComments
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    loading: false,
    question: state.comments.question,
    // user_comment: state.comments.user_comment,

    // users_info: state.comments.users_info,
    // comments: state.comments.comments,
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(Answer)

// export default connect(mapStateToProps, mapDispatchToProps)(Comments)

