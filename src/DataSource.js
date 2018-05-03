export class DataSource{
    static _ds = {};
    constructor(name, url){
        this.url = url;
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