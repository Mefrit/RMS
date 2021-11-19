


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
function Teacher(props) {
    console.log("Teacher props", props);
    const [teach, setTeachModeState] = useState(false);
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
    console.log('props Teacher', props, "loading", loading, "type_resource", type_resource);
    const fetchData = async () => {

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
        fetchData();
    }, [type_resource]);

    // function addMessage(event) {
    //     event.preventDefault();
    //     const new_message = [{
    //         content: content,
    //         id: Date.now().toString()
    //     }];
    //     // редукс уже передал в пропсы эту функцию
    //     props.addMessage(new_message);
    //     setContent('');
    // }
    function renderDocsList(data) {

        return data.map(elem => {
            console.log('elem.url', elem.url, elem.mark);
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
            // answer.list.fo
            // setContent('');
        });
    }
    const setTeachMode = (value) => {

        postJSON("/?module=Teacher&action=GetRecomendation", {
            letter: letter,
            type_resource: type_resource
        }).then((answer) => {
            props.hideLoader();

            if (answer.result) {
                // props.setCacheMessages(answer.list);
                console.log("answer.list", answer);
                setDocsList(answer.links);
                setTeachModeState(value);
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
                    <a className={teach ? "btn col-3 gy-3 " : "btn col-3 gy-3 btn-primary"} onClick={() => { setTeachMode(true) }} href="#">Обучение</a>
                    <div className="col-1"></div>
                    <a className={teach ? "btn col-3 gy-3 btn-primary" : "btn col-3 gy-3 "} onClick={() => { setTeachMode(false) }} href="#">Рекомендации системы к письму</a>
                    <div className="col-1"></div>
                    <a className={"btn col-3 gy-3 "} onClick={() => { console.log("add LInk"); }} href="#">Добавить ссылку на страницу документации</a>
                </div>
                <div className="row py-2">
                    <textarea className="col-sm form-control" value={letter} rows={5} name="" id="" onChange={(ev) => { setLetter(ev.target.value) }}></textarea>
                </div>

                <div className="row ">
                    <select className=" col-sm form-select gy-2" onChange={setUsersLinks} size={8} style={style_select} multiple>
                        {renderDocsList(docs_list)}
                    </select>
                </div>
                {!teach ? <div>
                    <span className="row">Выбор ссылок документации из различных ресурсов.</span>
                    <div className="row gy-1 ">
                        <a href="#" onClick={() => { setTypeResource("cms"); }} className={type_resource == "cms" ? "col-2 btn disabled" : "col-1  btn"}>CMS</a>
                        <a href="#" onClick={() => { setTypeResource("cis"); }} className={type_resource == "cms" ? "col-2 btn " : "col-1  btn disabled"}>CIS</a>
                    </div>
                    <div className="row justify-content-md-center">
                        <input type="button" className="col-3 btn btn-primary" onClick={train} value="Обучить алгоритм" />
                    </div>
                </div> : ""}
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


// class App extends React.Component<any, any> {
//     constructor(props) {
//         super(props)
//         this.state = {
//             content: '',
//             messages: []
//         }
//     }
//     componentDidMount() {
//         this.props.showLoader();
//         postJSON("/?module=App&action=getList", {
//             page: 1,
//             on_page: 20,
//             order: "time_receipt"
//         }).then((result) => {
//             this.props.hideLoader();
//             console.log('result', result);
//         });
//     }
//     changeInputHandler = event => {
//         event.persist()
//         this.setState(prev => ({
//             ...prev, ...{
//                 [event.target.name]: event.target.value
//             }
//         }));
//     }

//     addMessage = event => {
//         event.preventDefault();
//         const { content } = this.state;
//         const new_message = [{
//             content: content,
//             id: Date.now().toString()
//         }];

//         // редукс уже передал в пропсы эту функцию
//         this.props.addMessage(new_message);
//         this.setState({ content: '' });

//     }
//     render() {
//         return (
//             <div className="container" >
//                 <div className="row">
//                     <List />
//                     <div className="col-sm input-group">
//                         <div>
//                             <input
//                                 type="text"
//                                 className=" form-control"
//                                 id="content"
//                                 value={this.state.content}
//                                 name="content"
//                                 onChange={this.changeInputHandler}
//                             />
//                             <input
//                                 type="button"
//                                 className="btn btn-primary"
//                                 id="content"
//                                 value="add mesage"
//                                 name="add"
//                                 onClick={this.addMessage}

//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div >);
//     }
// }
//fix me Props interface
