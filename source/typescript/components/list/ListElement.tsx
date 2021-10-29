import * as React from 'react'

export default ({ message }) => {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{message.content}</h5>

            </div>
        </div>
    )
}
