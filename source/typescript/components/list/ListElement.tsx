import * as React from "react"
import { useState } from "react";
import { getTime } from "../../lib/module_functions";
export default ({ props }) => {
    console.log("props!!!!!!", props);
    const [open_modal, setModal] = useState(false);
    return (
        <li className="row mt-3" >

            <div className="dropdown col-1">
                <button className="btn btn-secondary dropdown-toggle" onClick={() => { setModal(!open_modal) }} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                </button>
                <ul className={open_modal ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" href={"./comments.html?id_question=" + props.id_question}>Посмотреть комментарии</a></li>
                    <li><a className="dropdown-item" href={"./teach.html?id_question=" + props.id_question}>Обучить алгоритм по письму</a></li>
                    <li><a className="dropdown-item" href={"./teach.html?id_question=" + props.id_question + "&mode=recomendation"}>Посмотреть, рекомендации системы по этому вопросу</a></li>
                </ul>
            </div>
            <div className="col-7">
                <p >{props.question}</p>
                <a className="link-info" href={"./answer.html?id_question=" + props.id_question}>Ответить</a>
            </div>

            <div className="col-2 text-center " >{props.time_answering ? getTime(new Date(props.time_answering)) : "x"}</div>
            <div className="col-2 text-center ">{props.time_receipt ? getTime(new Date(props.time_receipt)) : "y"}</div>
        </li >
    )
}
