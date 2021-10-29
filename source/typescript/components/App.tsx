import * as React from "react";

import List from "./list/List"

import { connect } from 'react-redux';
import { addMessage, showLoader, hideLoader } from '../redux_project/actions/actionsList'
import { postJSON } from "../lib/query"

class App extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            messages: []
        }
    }
    componentDidMount() {
        // let cache_test = ["1", "2", "3", "4"].map(content => {
        //     return {
        //         content: content,
        //         id: Date.now().toString() + Math.random() * 10
        //     }
        // })
        this.props.showLoader();
        postJSON("/?module=registration&action=Enter", {
            test: "123"
        }).then((result) => {
            console.log('result', result);
        });

        // setTimeout(() => {
        //     this.props.addMessage(cache_test);
        //     this.props.hideLoader();
        //     this.setState(prev => ({
        //         ...prev, ...{
        //             messages: cache_test
        //         }
        //     }))
        // }, 4000);
    }
    changeInputHandler = event => {
        event.persist()
        this.setState(prev => ({
            ...prev, ...{
                [event.target.name]: event.target.value
            }
        }))
    }
    addMessage = event => {
        event.preventDefault();
        const { content } = this.state;
        const new_message = [{
            content: content,
            id: Date.now().toString()
        }];
        console.log("addMessage", new_message);
        // редукс уже передал в пропсы эту функцию
        this.props.addMessage(new_message);
        this.setState({ content: '' });

    }
    render() {
        return (
            <div className="container" >
                <div className="row">
                    <List />
                    <div className="col-sm input-group">
                        <div>
                            <input
                                type="text"
                                className=" form-control"
                                id="content"
                                value={this.state.content}
                                name="content"
                                onChange={this.changeInputHandler}
                            />
                            <input
                                type="button"
                                className="btn btn-primary"
                                id="content"
                                value="add mesage"
                                name="add"
                                onClick={this.addMessage}

                            />
                        </div>
                    </div>
                </div>
            </div >);
    }
}
// прокидывания функций в компонент
const mapDispatchToProps = {
    addMessage, showLoader, hideLoader
}
// инициализация state в компоненте
const mapStateToProps = state => ({
    messages: state.app.messages,
    loading: false
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(App)