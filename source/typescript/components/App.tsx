import * as React from "react"
import { useEffect, useState } from "react";
import List from "./list/List"

import { connect } from 'react-redux';
import { addMessage, showLoader, hideLoader, setCacheMessages } from '../redux_project/actions/actionsList'
import { postJSON } from "../lib/query"
// REACT.MEME
// REACT.useCallBack
// React.useMeme
// React.lazy
// React.windows -библиотека
function App(props) {

    const [content, setContent] = useState("");
    // const [messages, setMessages] = useState([]);
    console.log('props APP', props);
    // == componentDidMount
    useEffect(() => {
        props.showLoader();
        const fetchData = async () => {
            postJSON("/?module=App&action=GetList", {
                page: 1,
                on_page: 20,
                order: "time_receipt"
            }).then((answer) => {
                props.hideLoader();
                console.log("result FORM SERVER", answer);
                if (answer.result) {


                    props.setCacheMessages(answer.list);


                } else {
                    alert(answer.message);
                }

                setContent('');
            });

        };
        fetchData();
    }, []);

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

    return (
        <div className="container" >
            <div className="column">
                <List />
            </div>
        </div >);

}
// прокидывания функций в компонент
const mapDispatchToProps = {
    addMessage, showLoader, hideLoader, setCacheMessages
}
// инициализация state в компоненте
const mapStateToProps = state => ({
    messages: state.app.messages,
    loading: false
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