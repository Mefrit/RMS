export class Module_Default {
    db_obj: any;
    constructor(props) {
        this.db_obj = props.db_obj;
    }
    // все актион связанные с БД возвращают Promise?
    runtAction(name_action, data) {
        return this["action" + name_action](data);
    }
}
