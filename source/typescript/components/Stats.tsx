// import { postJSON } from "../lib/query"
// import { connect, useSelector } from 'react-redux'
// import { useEffect, useState } from "react";

// import { hideLoaderStats, showLoaderStats } from '../redux_project/actions/actionStats'
// import * as React from "react"
// import Loader from '../components/loader'
import * as React from 'react';
import { postJSON } from "../lib/query"
import { connect, useSelector } from 'react-redux'
import { useEffect, useState } from "react";


import { StatsViewer } from '../components/stats/statsviewer';
function Stats(props) {

    // const initdata = this.props.init.data;
    // initdata.action = this.props.action;

    const options = {
        title: {
            text: 'My chart'
        },
        series: [{
            data: [1, 2, 3]
        }]
    }
    return (
        <div>
            <StatsViewer initialData={options}></StatsViewer>
        </div>

    );

}
const mapDispatchToProps = {
    // showLoaderAnswer,
    // hideLoaderAnswer
    // hideLoaderComments,
    // loadInfoComments,
    // updateComments
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    loading: false,
    // question: state.comments.question,
    // user_comment: state.comments.user_comment,

    // users_info: state.comments.users_info,
    // comments: state.comments.comments,
})
export default connect(mapStateToProps, mapDispatchToProps)(Stats)

// export default connect(mapStateToProps, mapDispatchToProps)(Comments)

