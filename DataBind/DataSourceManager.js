import axios from 'axios'
export class DataSourceManager{
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
    static ready(callback) {
        var dss = [];
        for (var key in this._ds) {
            var item = this._ds[key];
            // callback(this._ds[item])
            if (item.meta !== undefined) {
                item.inst = window["tg-turing"].DataAdapterFactory.create(item.meta, item.name, item.findParams);	
            } else {
                item.inst = window["tg-turing"].DataAdapterFactory.create();
                dss.push(item.inst.load(item.url, item.name, item.findParams))
            }
        }
        if (dss.length > 0) {
            axios.all(dss).then(function() {
                callback();
            })
        } else {
            callback();
        }
    }
}