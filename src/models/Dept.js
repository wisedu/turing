import {DataAdapter} from '../DataBind/DataAdapter'
import iviewAdapter from '../ComAdapter/iviewAdapter'
export default class extends DataAdapter {
    constructor() {
        super()
        let struct = {
            "default": {
                name: { caption: "名称" },
                parent_id: { caption: "父级部门编号" },
            },
            "默认列表": {
                name: {},
                parent_id: {},
            },
            "默认表单": {
                id: {},
                name: {},
                parent_id: {},
                created_at: {},
                updated_at: {},
                deleted_at: {},
            },
            "查询": {
            }
        }
        this.actions.find.url = "/api/dept";
        this.actions.find.method = "get"
        this.actions.save.url = "/api/dept/save";
        this.actions.delete.url = "/api/dept";
        this.actions.delete.method = "delete"

        this.setMeta(struct);
    }
    meta(metaid, iviewtype, params) {
        return iviewAdapter(iviewtype, this.getMeta(metaid), params);
    }
    toTreeData(data) {
        return iviewAdapter("tree", data, {ukey:"id", pkey:'pId', root: "", label:"name"})
    }
}