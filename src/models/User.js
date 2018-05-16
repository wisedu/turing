import turing from 'tg-turing'
export default class {
    constructor() {
        this.dataAdapter = new turing.DataAdapter();
        let struct = {
            "default": {
                name: { caption: "姓名" },
                workcode: { caption: "工号" },
                photo: { caption: "照片" },
            },
            "grid": {
                name: {},
                workcode: {},
                photo: {},
            },
            "form": {
                name: {},
                workcode: {},
                photo: {},
            },
            "search": {
            }
        }
        this.dataAdapter.actions.find.url = "/api/user";
        this.dataAdapter.actions.save.url = "/api/user/save";
        this.dataAdapter.actions.delete.url = "/api/user";
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