import * as React from "react"
import { useEffect, useState } from "react";
import { connect } from 'react-redux';
import { getCalendarDate } from "../../lib/module_functions";
import { startSearch } from '../../redux_project/actions/actionsList'
const Search = (props) => {

    const [mode, setMode] = useState("none");
    const date = new Date();
    const [name_organization, setNameOrganization] = useState("");
    const [num_question, setNumQuestion] = useState("");
    const [time_limit_end, setTimeLimitEnd] = useState(date.getTime());
    const [time_limit_start, setTimeLimitStart] = useState(0);
    useEffect(() => {
        props.startSearch({
            time_limit_start: time_limit_start,
            time_limit_end: time_limit_end,
            name_organization: name_organization,
            num_question: num_question,
            mode: mode
        })

    }, [time_limit_start, time_limit_end, name_organization, num_question, mode]);
    const renderSearchInterface = (mode) => {
        switch (mode) {
            case "organizations":
                return <input type="text" value={name_organization} onChange={(ev) => { setNameOrganization(ev.target.value) }} />
            case "num_question":
                return <input type="number" value={num_question} onChange={(ev) => { setNumQuestion(ev.target.value) }} />
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
                        <span className="col-1 m-2 mt-0 mb-0">По   </span>
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
                    <option selected disabled value="none">--</option>
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

    startSearch
}
// измененеие в пропсах, когда поменялся state
const mapStateToProps = state => ({
    startSearch: {}
})
export default connect(mapStateToProps, mapDispatchToProps)(Search)
