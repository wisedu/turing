import turing from 'tg-turing'
export default class {
    constructor() {
        this.dataAdapter = new turing.DataAdapter();
        let struct = {
            "default": {
                name: { caption: "名称" },
                parent_dept_id: { caption: "父级部门编号" },
            },
            "grid": {
                name: {},
                parent_dept_id: {},
            },
            "form": {
                id: {},
                name: {},
                parent_dept_id: {},
                created_at: {},
                updated_at: {},
                deleted_at: {},
            },
            "search": {
            }
        }
        this.dataAdapter.actions.find.url = "/api/dept";
        this.dataAdapter.actions.save.url = "/api/dept/save";
        this.dataAdapter.actions.delete.url = "/api/dept";
        this.dataAdapter.actions.delete.method = "delete"

        this.dataAdapter.setMeta(struct);
    }
    meta(metaid, iviewtype) {
        return turing.iviewAdapter(iviewtype, this.dataAdapter.getMeta(metaid));
    }
    findAll(params) {
        return this.dataAdapter.findAll(params)
    }
    save(data) {
        return this.dataAdapter.save(data)
    }
    delete(id) {
        this.dataAdapter.actions.delete.url += "/" + id;
        return this.dataAdapter.delete()
    }
}