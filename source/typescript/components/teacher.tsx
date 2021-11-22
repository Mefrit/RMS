


import * as React from "react"
import { useEffect, useState } from "react";
// import List from "./list/List"
import Loader from '../components/loader'
import LinkEditor from '../components/linkEditor'
import { connect, useSelector } from 'react-redux'
import { showLoader, hideLoader } from '../redux_project/actions/actionTeacher'
import { postJSON } from "../lib/query"
// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function Teacher(props) {
    console.log("Teacher props", props);
    const [mode, setTeachModeState] = useState('teach');
    const [docs_list, setDocsList] = useState([]);
    const [type_resource, setTypeResource] = useState(props.type_resource);
    const [letter, setLetter] = useState("Добрый день!  На сайте МДОУ № 15 «Аленушка» ЯМР  показывает ошибку загрузки документа, хотя все раньше работало! Где документы? и сслыки  В чем может быть причина? Почему одни ссылки работают, а другие нет?");
    let user_docs_links = [];
    const style_select = {
        height: "250px"
    };

    // 
    // == componentDidMount,
    const loading = useSelector((state: any): any => state.teacher.loading);

    const loadLinksList = async () => {

        postJSON("/?module=Teacher&action=GetDocsList", {
            type_resource: type_resource
        }).then((answer) => {
            props.hideLoader();
            console.log("result FORM SERVER TEACHER", answer);
            if (answer.result) {


                // props.setCacheMessages(answer.list);
                console.log("answer.list", answer.docs_links);
                setDocsList(answer.docs_links);
            } else {
                alert(answer.message);
                setDocsList([]);
            }
            // answer.list.fo
            // setContent('');
        });

    };
    useEffect(() => {
        console.log("useEffect", type_resource);
        props.showLoader();
        loadLinksList();
    }, [type_resource]);

    function renderDocsList(data) {

        return data.map(elem => {

            return <option key={elem.url + elem.title} value={elem.url} title={elem.description}>{elem.title + `   (${elem.url})`}</option>
        })
    }
    const train = () => {
        console.log("train", letter)
        postJSON("/?module=Teacher&action=Train", {
            letter: letter,
            type_resource: type_resource,
            user_docs_links: user_docs_links
        }).then((answer) => {
            props.hideLoader();
            console.log("result FORM SERVER TEACHER", answer);
            if (answer.result) {
                console.log("answer.list", answer.docs_links);
                setDocsList(answer.docs_links);
            } else {
                alert(answer.message);
                if (!docs_list) {
                    setDocsList([]);
                }
            }

        });
    }
    const loadRecomendation = async () => {
        postJSON("/?module=Teacher&action=GetRecomendation", {
            letter: letter,
            type_resource: type_resource
        }).then((answer) => {
            props.hideLoader();

            if (answer.result) {
                // props.setCacheMessages(answer.list);
                console.log("answer.list", answer);
                setDocsList(answer.links);

            } else {
                alert(answer.message);
                if (!docs_list) {
                    setDocsList([]);
                }
            }
            // answer.list.fo
            // setContent('');
        });
    }
    const addLink2List = async (link_obj, mode) => {
        console.log("addLink1List", link_obj);
        props.showLoader();
        postJSON("/?module=Teacher&action=EditListLinks", {
            link_obj: link_obj,
            mode: mode
        }).then((answer) => {
            props.hideLoader();

            if (answer.result) {
                // props.setCacheMessages(answer.list);
                console.log("answer.list", answer);
                // setDocsList(answer.links);

            } else {
                alert(answer.message);
                // if (!docs_list) {
                //     setDocsList([]);
                // }

            }
            // setTeachMode("teach")
            // answer.list.fo
            // setContent('');
        });
    }
    const setTeachMode = (mode) => {
        setTeachModeState(mode);
        console.log("setTeachMode mode", mode)
        if (mode == "teach") {
            loadLinksList()
        } else {
            if (mode == "recomendation") {
                loadRecomendation();
            } else {
                // addDocs
                console.log(mode, props);
                // addLink2List(props.link_object, "add2list")
            }

        }

    }
    const setUsersLinks = (e) => {
        var options = e.target.options;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {

                value.push(options[i].value);
            }
        }
        console.log(value);
        user_docs_links = value;

    }
    if (loading) {
        return <Loader />
    } else
        return (
            <form className="container  min-vh-100" >
                <div className="row ">
                    <a className={mode == "teach" ? "btn col-3 gy-3 btn-primary" : "btn col-3 gy-3 "} onClick={() => { setTeachMode("teach") }} href="#">Обучение</a>
                    <div className="col-1"></div>
                    <a className={mode == "recomendation" ? "btn col-3 gy-3 btn-primary" : "btn col-3 gy-3 "} onClick={() => { setTeachMode("recomendation") }} href="#">Рекомендации системы к письму</a>
                    <div className="col-1"></div>
                    <a className={mode == "edit_links_list" ? "btn col-3 gy-3 btn-primary" : "btn col-3 gy-3 "} onClick={() => { setTeachMode("edit_links_list") }} href="#">Добавить ссылку на страницу документации</a>
                </div>
                {mode != "edit_links_list" ? <div className="row py-2">
                    <textarea className="col-sm form-control" value={letter} rows={5} name="" id="" onChange={(ev) => { setLetter(ev.target.value) }}></textarea>
                </div> : ""}
                {mode != "edit_links_list" ? <div className="row ">
                    <select className=" col-sm form-select gy-2" onChange={setUsersLinks} size={8} style={style_select} multiple disabled={mode != "teach"}>
                        {renderDocsList(docs_list)}
                    </select>
                </div> : ""}

                {mode == "teach" ? <div>
                    <span className="row">Выбор ссылок документации из различных ресурсов.</span>
                    <div className="row gy-1 ">
                        <a href="#" onClick={() => { setTypeResource("cms"); }} className={type_resource == "cms" ? "col-2 btn disabled" : "col-1  btn"}>CMS</a>
                        <a href="#" onClick={() => { setTypeResource("cis"); }} className={type_resource == "cms" ? "col-2 btn " : "col-1  btn disabled"}>CIS</a>
                    </div>
                    <div className="row justify-content-md-center">
                        <input type="button" className="col-3 btn btn-primary" onClick={train} value="Обучить алгоритм" />
                    </div>
                </div> : mode == "edit_links_list" ? <LinkEditor /> : ""}
            </form >);
}
// прокидывания функций в компонент
const mapDispatchToProps = {
    showLoader, hideLoader
}
// инициализация state в компоненте
const mapStateToProps = state => ({
    docs_links: state.teacher.docs_links,
    loading: false,

    type_resource: "cms"
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(Teacher)
