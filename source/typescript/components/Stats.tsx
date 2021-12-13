// import { postJSON } from "../lib/query"

import * as React from 'react';
import Loader from '../components/loader';
import { postJSON } from "../lib/query";
import { connect, useSelector } from 'react-redux';
import { useEffect, useState } from "react";

import { showLoaderStats, hideLoaderStats } from '../redux_project/actions/actionStats'

import { StatsViewer } from '../components/stats/statsviewer';
import { getCalendarDate } from "../lib/module_functions"
function Stats(props) {
    const date = new Date();
    const loading = useSelector((state: any): any => state.comments.loading);
    const [time_limit_end, setTimeLimitEnd] = useState(date.getTime());
    const [time_limit_start, setTimeLimitStart] = useState(date.setMonth(date.getMonth() - 1));

    const [stats_data, setStatsData] = useState([]);
    useEffect(() => {
        props.showLoaderStats();
        postJSON("/api", {
            module: "Stats",
            action: "GetStats",
            time_end: time_limit_end,
            time_start: time_limit_start
        }).then((res) => {
            props.hideLoaderStats();

            if (res.result) {
                console.log("res.result answer", res);
                setStatsData(res.list)
                // props.loadInfoComments({
                //     comments: res.answer.comments,
                //     question: res.answer.question,
                //     users_info: res.answer.users_info,
                // });
                // if (res.answer.id_user && id_user === undefined) {
                //     setIdUser(res.answer.id_user);
                //     console.log("result FORM SERVER Comments WHERE id_question =", res, id_user);
                // }
            } else {
                alert(res.message);
            }
        });
    }, []);
    const options: Highcharts.Options = {
        title: {
            text: 'Статистика по обращениям пользователей'
        },
        series: [{
            type: 'line',
            name: 'Обращения',
            data: stats_data.map(elem => elem.time_receipt)
        }],
        xAxis: {
            title: {
                text: 'Дата'
            },
            categories: stats_data.map((item) => getCalendarDate(item.time_receipt))
        },
        exporting: {
            enabled: true
        }

    }
    // stats_data.map(elem => elem.time_receipt)

    if (loading) {
        return <Loader />
    }
    console.log("Stats options", options);
    return (

        <div>
            <StatsViewer options={options} />
        </div>
    );
}
const mapDispatchToProps = {
    showLoaderStats,
    hideLoaderStats
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

