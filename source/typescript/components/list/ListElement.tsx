import * as React from "react"
import { useState } from "react";
import { getTime } from "../../lib/module_functions";
export default ({ props }) => {
    const [open_modal, setModal] = useState(false);
    const [open_modal_files, setModalFiles] = useState(false);
    if (props.files.length > 0) {
        console.log(props.files);
    }
    const menu = [{
        path: "./comments.html?id_question=" + props.id_question, name: "Посмотреть комментарии"
    }, {
        path: "./teach.html?id_question=" + props.id_question, name: "Обучить алгоритм по письму"
    }, {
        path: "./teach.html?id_question=" + props.id_question + "&mode=recomendation", name: "Посмотреть, рекомендации системы по этому вопросу"
    }]
    const renderDrobButtonElem = (cache) => {
        return cache.map(elem => {
            return <li><a target="blank" className="dropdown-item" href={elem.path}>{elem.name}</a></li>
        })
    }
    const question = props.question.slice(0, 400);
    return (
        <li className="row mt-3 border-bottom pb-2 m-0 w-100 " >

            <div className="dropdown col-1">
                <button className="btn btn-secondary dropdown-toggle" onClick={() => { setModal(!open_modal) }} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                </button>
                <ul className={open_modal ? "dropdown-menu show" : "dropdown-menu"} aria-labelledby="dropdownMenuButton1">
                    {renderDrobButtonElem(menu)}
                    {/* <li><a className="dropdown-item" href={"./comments.html?id_question=" + props.id_question}>Посмотреть комментарии</a></li>
                    <li><a className="dropdown-item" href={"./teach.html?id_question=" + props.id_question}>Обучить алгоритм по письму</a></li>
                    <li><a className="dropdown-item" href={"./teach.html?id_question=" + props.id_question + "&mode=recomendation"}>Посмотреть, рекомендации системы по этому вопросу</a></li> */}
                </ul>
            </div>
            <div className="col-6 d-flex flex-column align-items-start ">
                <div className="d-flex w-100 justify-content-between mb-auto">
                    <p style={{ marginRight: "25px" }} >{question}</p>
                    <span style={{ minWidth: "50px" }} className="d-flex">{"№ " + props.num_question}</span>
                </div>
                <div className="d-flex w-100  justify-content-between">
                    <a className="link-info" href={"./answer.html?id_question=" + props.id_question}>Ответить</a>
                    {props.files.length > 0 ?
                        <label > Файлы   <button className=" ml-2 btn  dropdown-toggle" onClick={() => { setModalFiles(!open_modal_files) }} type="button" id="dropdownMenuButton_files" data-bs-toggle="dropdown" aria-expanded="false">
                        </button></label>
                        :
                        ""
                    }
                    <ul className={open_modal_files ? "dropdown-menu  bd-highlight show" : " dropdown-menu"} aria-labelledby="dropdownMenuButton_files">
                        {renderDrobButtonElem(props.files)}
                    </ul>
                </div>
            </div>

            <div className="col-1 text-center " >{props.time_answering ? getTime(new Date(props.time_answering)) : "x"}</div>
            <div className="col-2 text-center ">{props.time_receipt ? getTime(new Date(props.time_receipt)) : "y"}</div>
            <div className="col-2 text-center " >{props.short_name ? props.short_name : "Неизвестно"}</div>
        </li >
    )
}
