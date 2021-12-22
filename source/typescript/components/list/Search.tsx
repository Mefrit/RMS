import * as React from "react"
import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getTime } from "../../lib/module_functions";
import { getCalendarDate } from "../../lib/module_functions";
const Search = () => {

    const [mode, setMode] = useState("time_receipts");
    const date = new Date();
    const [name_organization, setNameOrganization] = useState("1");
    const [num_request, setNumRequest] = useState("2");
    const [time_limit_end, setTimeLimitEnd] = useState(date.getTime());
    const [time_limit_start, setTimeLimitStart] = useState(date.getTime());
    useEffect(() => {
        // if (stats_total_data.cache.length == 0) {
        //     props.showLoaderStats();
        // }
        // postJSON("/api", {
        //     module: "Stats",
        //     action: "GetStats",
        //     time_end: time_limit_end,
        //     time_start: time_limit_start
        // }).then((res) => {
        //     if (stats_total_data.cache.length == 0) {
        //         props.hideLoaderStats();
        //     }
        //     if (res.result) {
        //         console.log("res.result answer", res);
        //         setStatsTotalData(res.total_info)
        //         setStatsAnsweredData(res.answered_info)
        //     } else {
        //         alert(res.message);
        //     }
        console.log(time_limit_start, time_limit_end, name_organization, num_request, mode);
    }, [time_limit_start, time_limit_end, name_organization, num_request, mode]);
    const renderSearchInterface = (mode) => {
        switch (mode) {
            case "organizations":
                return <input type="text" value={name_organization} onChange={(ev: any) => { setNameOrganization(ev.target.value) }} />
            case "num_question":
                return <input type="number" value={num_request} onChange={(ev: any) => { setNumRequest(ev.target.value) }} />
            case "time_receipt":
                return <div className="ml-3  d-flex align-items-center">
                    <label className=" d-flex align-items-center">
                        <span className="col-1">С </span>
                        <input
                            type="date"
                            value={getCalendarDate(new Date(time_limit_start))}
                            onChange={(ev) => { setTimeLimitStart(new Date(ev.target.value).getTime()) }}
                            className="form-control" />
                    </label>
                    <label className="d-flex align-items-center ml-1" >
                        <span className="col-1 m-1 mt-0 mb-0">По   </span>
                        <input
                            type="date"
                            value={getCalendarDate(new Date(time_limit_end))}
                            onChange={(ev) => { setTimeLimitEnd(new Date(ev.target.value).getTime()) }}
                            className="form-control"
                        />
                    </label>
                </div>

        }
    }
    // const question = props.question.slice(0, 400);
    return (
        <div className="form-check m-1 mt-0 mb-0 d-flex align-items-center">
            <label className=" d-flex align-items-center">Поиск
                <select name="" onChange={(ev) => { setMode(ev.target.value) }} className="form-select m-3 mt-0 mb-0" id="">
                    <option value="organizations">По названию организации</option>
                    <option value="num_question">По номеру обращения</option>
                    <option value="time_receipt">По времени поступления</option>
                </select>
            </label>
            {renderSearchInterface(mode)}
        </div>
    )
}
const mapDispatchToProps = {
    // showLoaderStats,
    // hideLoaderStats
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    // loading: false,

})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
// export default Search;
