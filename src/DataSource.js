export class DataSource{
    static _ds = {};
    inst;
    name;
    url;
    meta;
    findParams;
    constructor(name, url, params){
        if (typeof(url) === "string") {
            this.url = url;
        } else if (typeof(url) === "object") {
            this.meta = url;
        } else {
            throw "第二个参数应为url字符串，或者是模型的json"
        }
        this.findParams = params;
        this.inst = undefined;
        this.name = name;
    }
    static set(ds) {
        this._ds[ds.name] = ds;
    }
    static get(name) {
        return this._ds[name].inst;
    }
    static init(callback) {
        for (var item in this._ds) {
            callback(this._ds[item])
        }
    }
}