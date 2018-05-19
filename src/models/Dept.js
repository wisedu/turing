import {DataAdapter} from '../DataBind/DataAdapter'
import iviewAdapter from '../ComAdapter/iviewAdapter'
export default class extends DataAdapter {
    constructor() {
        super()
        let views = {
            "default": {
                id: { caption: "编号" },
                name: { caption: "名称" },
                pId: { caption: "父级部门编号" },
            },
            "默认列表:table": {
                id: {},
                name: {},
                pId: {},
            },
            "默认表单:form": {
                id: {},
                name: {},
                pId: {},//xtype:"tree", url:"/api/dept"
            },
            "查询": {
            }
        }
        this.actions.find.url = "/api/dept";
        this.actions.find.method = "get"
        this.actions.save.url = "/api/dept/save";
        this.actions.delete.url = "/api/dept";
        this.actions.delete.method = "delete"

        this.initView(views);
    }
    view(name, params) {
        let props = name.split(":")
        let iviewtype = props[1];
        return iviewAdapter(iviewtype, this.getView(name), params);
    }
    toTreeData(data) {
        return iviewAdapter("tree", data, {ukey:"id", pkey:'pId', root: "", label:"name"})
    }
}