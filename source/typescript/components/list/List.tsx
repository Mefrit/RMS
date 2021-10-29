import * as React from 'react'
import { connect, useSelector } from 'react-redux'
import { Loader } from '../loading'
import ListElement from "./listElement"

//fix me Props interface
const List = () => {

    const messages = useSelector((state: any): any => state.app.messages);
    const loading = useSelector((state: any): any => state.app.loading);
    console.log("List====>>> ", messages, loading);
    if (loading) {
        return <Loader />
    } else
        if (!messages.length) {
            return <p className="text-center">Сообщений пока нет</p>
        }
    return <div className="col-sm" > {messages.map(message => <ListElement message={message} key={message.id} />)}</div>
}

const mapStateToProps = state => {
    // установка начальных значений
    return {
        messages: state.app.messages,

        loading: false
    }
}
// проброска первоначальных state в компонент
export default connect(mapStateToProps, null)(List)
