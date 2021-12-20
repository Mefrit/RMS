import * as React from "react"
import { useEffect, useState } from "react";
import List from "./list/List"

import { connect, useSelector } from 'react-redux';
import { addMessage, showLoader, hideLoader, setCacheMessages, loadMoreElements } from '../redux_project/actions/actionsList'
import { postJSON } from "../lib/query"
// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function App(props, dispatchProps) {
    console.log('props APP', props);
    const on_page = useSelector((state: any): any => state.app.on_page);
    // const [messages, setMessages] = useState([]);

    // == componentDidMount
    useEffect(() => {

        props.showLoader();
        console.log("Here useEffect App", props, on_page);
        const fetchData = async () => {
            postJSON("/api", {
                on_page: on_page,
                order: "time_receipt",
                module: "App",
                action: "GetList"
            }).then((answer) => {
                props.hideLoader();
                if (answer.result) {

                    props.setCacheMessages(answer.list);
                } else {
                    alert(answer.message);
                }

            });

        };
        fetchData();
    }, [on_page]);

    return (
        <div className="container" >
            <List loadMoreElements={props.loadMoreElements} />
        </div >);

}
// прокидывания функций в компонент
const mapDispatchToProps = {
    addMessage,
    showLoader,
    hideLoader,
    setCacheMessages
}
// инициализация state в компоненте
const mapStateToProps = state => ({
    messages: state.app.messages,
    loading: false,
    on_page: state.app.on_page
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(App)


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