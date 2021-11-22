import * as React from "react"
import { useEffect, useState } from "react";
import { connect, useSelector } from 'react-redux'
import { addLink } from '../redux_project/actions/actionlinkEditor'
const LinkEditor = (props) => {

    const loading = useSelector((state: any): any => state.teacher.loading);
    console.log("linkEditor Props ", props);
    useEffect(() => {
        // console.log("useEffect", type_resource);
        props.addLink({
            title: "NEWWWWWWWWWWWWWWWW",
            link: "https:\/\/cms2.edu.yar.ru\/\/docs\/index.php?p=NEWWWWWWWWWWWWWWWW",
            description: "NEWWWWWWWWWWWWWWWW DESCRIPTRION "
        });
        // loadLinksList();
    }, []);
    return <div className="" role="status">
        Link!~ Editor
    </div>
}
const mapDispatchToProps = {
    addLink
}
// инициализация state в компоненте
const mapStateToProps = state => ({
    link_obj: state.teacher.link_obj,
    loading: false
})
// связка данных and exports
export default connect(mapStateToProps, mapDispatchToProps)(LinkEditor)