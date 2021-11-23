import * as React from "react"
import { useState } from "react";
export default ({ props }) => {

    const [open_modal, setModal] = useState(false);
    return (
        <li className="row mt-3">

            <div className="dropdown col-1">
                <button className="btn btn-secondary dropdown-toggle" onClick={() => { setModal(!open_modal) }} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                </button>
                <ul className={open_modal ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton1">
                    <li><a className="dropdown-item" href="#">Посмотреть комментарии</a></li>
                    <li><a className="dropdown-item" onClick={props.setMessage2TeacherModule} href="#">Обучить алгоритм по письму</a></li>
                    <li><a className="dropdown-item" href="#">Посмотреть, рекомендации системы по этому вопросу</a></li>
                </ul>
            </div>
            <span className="col-7">{props.question}</span>
            <div className="col-2 text-center " >{props.is_answered == "true" ? new Date(props.time_answering).toUTCString() : "x"}</div>
            <div className="col-2 text-center ">{props.time_receipt ? new Date(props.time_receipt).toUTCString() : "y"}</div>
        </li>
    )
}
