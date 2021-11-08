"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_Default = void 0;
class Module_Default {
    constructor(props) {
        this.db_obj = props.db_obj;
    }
    runtAction(name_action, data) {
        return this["action" + name_action](data);
    }
}
exports.Module_Default = Module_Default;

//# sourceMappingURL=../../maps/modules/lib/ModuleDefault.js.map
