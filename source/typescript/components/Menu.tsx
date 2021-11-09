import * as React from "react"
// import { connect, useSelector } from 'react-redux'


//fix me Props interface
const Menu = () => {

    // const messages = useSelector((state: any): any => state.app.messages);
    // const loading = useSelector((state: any): any => state.app.loading);
    // console.log("MEnu====>>> ", messages, loading);

    return <nav className="navbar navbar-expand-lg">

        <a className="nav-link " href="./index.html">Список писем</a>
        <a className="nav-link" href="./teach.html">Обучить</a>
        <a className="nav-link " href="https://cms2.edu.yar.ru////docs//index.php?p=editor_docs">Документация </a>
        {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button> */}
        {/* <div className="collapse navbar-collapse " id="navbarSupportedContent">
            <ul className="navbar-nav mr-4">
                <li className="nav-item">
                    <a className="nav-link " href="./index.html">Список писем</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="./teach.html">Обучить</a>
                </li>

            
                <li className="nav-item">
                    <a className="nav-link " href="https://cms2.edu.yar.ru////docs//index.php?p=editor_docs">Документация </a>
                </li>
            </ul>

        </div> */}
    </nav>
}

// const mapStateToProps = state => {
//     // установка начальных значений
//     return {
//         messages: state.app.messages,

//         loading: false
//     }
// }
// проброска первоначальных state в компонент
// export default connect(mapStateToProps, null)(Menu)
export default Menu
