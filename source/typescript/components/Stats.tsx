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
    const [mode, setModeStats] = useState("all");
    const [stats_total_data, setStatsTotalData] = useState({ cache: [], line_title: "" });
    const [stats_answered_data, setStatsAnsweredData] = useState({ cache: [], line_title: "" });
    useEffect(() => {
        if (stats_total_data.cache.length == 0) {
            props.showLoaderStats();
        }
        postJSON("/api", {
            module: "Stats",
            action: "GetStats",
            time_end: time_limit_end,
            time_start: time_limit_start
        }).then((res) => {
            if (stats_total_data.cache.length == 0) {
                props.hideLoaderStats();
            }
            if (res.result) {
                setStatsTotalData(res.total_info)
                setStatsAnsweredData(res.answered_info)
            } else {
                alert(res.message);
            }
        });
    }, [time_limit_start, time_limit_end]);
    function getStatsCache(mode, stats_total_data, stats_answered_data) {
        let result = [];
        switch (mode) {
            case "all":
                result = stats_total_data
                break;
            case "answered":
                result = stats_answered_data
                break;
        }
        return result
    }

    let stats_data: any = getStatsCache(mode, stats_total_data, stats_answered_data)
    const options: Highcharts.Options = {
        title: {
            text: 'Статистика по обращениям пользователей'
        },
        series: [{
            type: 'line',
            name: stats_data.line_title,
            data: stats_data.cache.map(elem => elem.count)
        }],
        xAxis: {
            title: {
                text: 'Дата'
            },
            categories: stats_data.cache.map(elem => elem.date)
        },
        yAxis: {
            title: {
                text: 'Количество'
            },
            tickInterval: 1
        },
        exporting: {
            enabled: true
        }
    }
    if (loading) {
        return <Loader />
    }
    console.log("Stats options", options);
    return (

        <div>
            <div className="row m-4 mb-3 mt-2">
                <label className="col-3 d-flex align-items-center">
                    <span className="col-1">С </span>
                    <input type="date" value={getCalendarDate(new Date(time_limit_start))} onChange={(ev) => { setTimeLimitStart(new Date(ev.target.value).getTime()) }} className="form-control" />
                </label>
                <label className="col-3 d-flex align-items-center ml-1" >
                    <span className="col-1 m-1 mt-0 mb-0">По   </span>
                    <input type="date" value={getCalendarDate(new Date(time_limit_end))} onChange={(ev) => { setTimeLimitEnd(new Date(ev.target.value).getTime()) }} className="form-control" />
                </label>

                <label className="col-2 d-flex align-items-center" >Все письма <input type="radio" checked={mode == "all"} onClick={() => { setModeStats("all") }} /></label>
                <label className="col-3 d-flex align-items-center" >Отвеченные письма <input type="radio" checked={mode == "answered"} onClick={() => { setModeStats("answered") }} /></label>
                <div className="col-1"></div>
            </div>
            <StatsViewer options={options} time_end={time_limit_end} time_start={time_limit_start} />
        </div>
    );
}
const mapDispatchToProps = {
    showLoaderStats,
    hideLoaderStats
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    loading: false,
})
export default connect(mapStateToProps, mapDispatchToProps)(Stats)

// export default connect(mapStateToProps, mapDispatchToProps)(Comments)

