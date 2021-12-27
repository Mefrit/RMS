import * as React from "react"
import { useState } from "react";
import { connect } from 'react-redux'
import { addLink } from '../redux_project/actions/actionlinkEditor'
const LinkEditor = (props) => {


    const [title, setTitle] = useState('Новая фича');
    const [description, setDescription] = useState('РАссказ о новой фиче в cms');
    const [link, setLink] = useState(props.link_obj.link);
    const [type_resource, setTypeResource] = useState('cms');

    const addLink2List = () => {

        props.addLink({
            title: title.trim(),
            link: link.trim(),
            description: description.trim(),
            type_resource: type_resource
        });
    }
    return <div>
        <div className="form-group">
            <label className="w-75" >Название страницы с документацией
                <input type="text" value={title} onChange={(ev) => { setTitle(ev.target.value) }} className="form-control" />
            </label>

        </div>
        <div className="form-group ">
            <label className="w-75" >Описание
                <textarea value={description} onChange={(ev) => { setDescription(ev.target.value) }} className="form-control" ></textarea>
            </label>
            {/* <small className="form-text text-muted">Описание содержит описание информации, о которой написанно в документации.</small> */}
        </div>
        <div className="form-group">
            <label className="w-75">Ссылка на ресурс
                <input type="text" value={link} onChange={(ev) => { setLink(ev.target.value) }} className="form-control" placeholder="https://..." />
            </label>
        </div>
        <div className="form-group">
            <label className="w-75">Тип ресурса
                <select className="form-select " onChange={(ev) => { setTypeResource(ev.target.value) }}>
                    <option value="cms">CMS</option>
                    <option value="cis">CIS</option>
                </select>
                <small className="form-text text-muted">Создание ссылки привязывается к определенному типу ресурса.</small>
            </label>
        </div>
        <button type="button" onClick={() => { addLink2List() }} className="btn btn-primary  p-1 mt-3">Догбавить ссылку</button>
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