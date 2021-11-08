import * as React from "react"

export default ({ message }) => {
    console.log("message ===> ", message);
    return (
        <li className=" row">


            <span className=" col-8">{message.question}</span>
            <div className=" col-2" >{message.is_answered == "true" ? new Date(message.time_answering).toUTCString() : "x"}</div>
            <div className=" col-2">{message.time_receipt ? new Date(message.time_receipt).toUTCString() : "y"}</div>
            {/* <div>{message.time_answering ? new Date(message.time_answering).toUTCString() : "y"}</div> */}

        </li>
    )
}
