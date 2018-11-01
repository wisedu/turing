import utils from '../utils.js';
import axios from 'axios'
import defaults from '../Defaults'

export class DataAdapter {
    constructor(meta) {
        this.__baseUrl = "";
        this.__doingUrl = "";
        this.__meta = meta;
        this.viewDefine;
        this.__orders = [];
        this.pageNumber = 1;
        this.pageSize = 20;
        this.name = "";
    }
    initView(views) {
        this.viewDefine = views;
    }
    getView(viewId) {
        let views = this.viewDefine;
        if (views === undefined || views[viewId] === undefined) {
            throw `${this.name} 缺少 ${viewId} 模型定义`
        }
        let result = {}
        for(let prop in views[viewId]) {
            result[prop] = {};
            //如果有分组，则循环分组中的items
            if (prop.startsWith("group:[")) {
                let newGroupItem = {}
                let groupItems = views[viewId][prop].items;
                for(let item in groupItems) {
                    newGroupItem[item] = {};
                    utils.extend(true, newGroupItem[item], views["default"][item], groupItems[item]);
                }
                result[prop].title = prop.match(/\[(.*?)\]/)[1];
                result[prop].items = newGroupItem;
                result[prop].desc = views[viewId][prop].desc;
            } else {
                utils.extend(true, result[prop], views["default"][prop], views[viewId][prop]);
            }
        }
        return result;
    }
    initData(viewId) {
        let views = this.viewDefine;
        let result = {}
        for(let prop in views[viewId]) {
            //如果有分组，则循环分组中的items
            if (prop.startsWith("group:[")) {
                let groupItems = views[viewId][prop].items;
                for(let item in groupItems){
                    result[item] = undefined;
                }
            } else {
                result[prop] = undefined;
            }
        }
        return result;
    }
    execute(action, data){
        var url = "";
        var params = data || action.params;
        let method = action.method || "get";

        if (typeof(action) === "string") {
            this.__doingUrl = action;
            this.onFetching("doing-string", true);
            url = this.__doingUrl;
            method = "post";
        } else {
            this.onFetching("doing", true);
            url = action.url;
        }

        if (url.substring(0, 1) === ".") {
            url = (window.apiPath || '') + url;//.substring(2, url.length)
        } else if (url.substring(0, 1) === "/") {
            url = (window.apiPath || '') + url;
        }

        let matchs = url.match(/\{(.*?)\}/ig);
        matchs = matchs === null ? [] : matchs;
        matchs.map(item => {
            url = url.replace(item, params[item.substring(1, item.length -1)])
        })

        if (this.querySetting !== undefined) {
            if (params === undefined) {
                params = {
                    querySetting: this.querySetting
                } 
            } else {
                params["querySetting"] = this.querySetting;
            }
        }

        if (method.toLowerCase() === "post") {
            return axios.post(url, params).catch(e=>{
                console.error(e)
                this.onFetching("error", false, e);
            })
        } else if (method.toLowerCase() === "delete") {
            //删除资源仅允许与rest接口约定的url方式
            return axios.delete(url).catch(e=>{
                console.error(e)
                this.onFetching("error", false, e);
            })
        } else {
            return axios.get(url, {params: params}).catch(e=>{
                console.error(e)
                this.onFetching("error", false, e);
            })
        }
    }
    events = {
        onLoad: null,
        onLoadMeta: null,
        onRefreshed: null
    }

    actions = {
        save:{
            url: "",
            method: "post",
            name: ""
        },
        delete:{
            url: "",
            method: "post",
            name: ""
        },
        findById:{
            url: "",
            method: "get",
            name: ""
        },
        findAll:{
            url: "",
            method: "post",
            name: "",
            params: {},
            orders: [],
        },
        //将废弃
        find:{
            url: "",
            method: "post",
            name: "",
            params: {},
            orders: [],
        }
    }
    
    querySetting = undefined

    querySettingBuilder(searchValues, defaultScope, ignoreEmpty){
        let ie = ignoreEmpty === undefined ? true : ignoreEmpty;
        let newQS = {};
        newQS[defaultScope] = {};
        for (const key in searchValues) {
            const element = searchValues[key];
            if (ie) {
                if (element === "") {
                    continue;
                } else if (element instanceof Array && !element.some(item => item !== "")) {
                    continue;
                }
            }
            if (key.indexOf("@") > -1) {
                let newScope = key.substring(0, key.indexOf("@"));
                let newKey = key.substring(key.indexOf("@") + 1, key.length);
                if (newQS[newScope] === undefined){
                    newQS[newScope] = {}
                } 
                newQS[newScope][newKey] = element;
            } else {
                newQS[defaultScope][key] = element;
            }
        }
        return newQS;
    }

    findAll(param) {
        var that = this;
        
        let defaultParams = {
            where: utils.extend(true, {}, (this.actions.findAll || this.actions.find).params, param || {})
            // where: utils.extend(true, {}, this.actions.find.params, param || {})
        };
        
        let orders = (this.actions.findAll || this.actions.find).orders || [];
        defaultParams["order"] = [orders.concat(this.__orders)];
        // defaultParams["order"] = [this.actions.findAll.orders.concat(this.__orders)];
        if (defaultParams["order"][0].length == 0) {
            delete defaultParams.order;
        }

        defaultParams["offset"] = (this.pageNumber - 1) * this.pageSize;
        defaultParams["limit"] = this.pageSize;

        // defaultParams = defaults.beforeFindAll[0](this.actions.find, defaultParams, {
        defaultParams = defaults.beforeFindAll[0]((this.actions.findAll || this.actions.find), defaultParams, {
            pageNumber: this.pageNumber, 
            pageSize: this.pageSize
        });

        // return this.execute(this.actions.findAll, defaultParams).then(function(result){
        //     return defaults.afterFindAll[0](result, that.actions.findAll, defaultParams)
        // });
        return this.execute((this.actions.findAll || this.actions.find), defaultParams).then(function(result){
            return defaults.afterFindAll[0](result, (that.actions.findAll || that.actions.find), defaultParams)
        });
    }
    findById(params) {
        return this.execute(this.actions.findById, params).then(function(result){
            return result.data;
        });
    }
    delete(params) {
        return this.execute(this.actions.delete, params).then(function(result){
            return result.data;
        });
    }
    save(data) {
        return this.execute(this.actions.save, data).then(function(result){
            return result.data;
        });
    }
    /**
     * @description 排序列
     * @example [{"key1":"+"},{"key2":"-"}]
     * @param {[]} fields 
     */
    order(fields){
        this.__orders = fields;
    }

    onFetching(status, result) {
        switch (status) {
            case "doing":
                break;
            case "done":
                break;
            case "error":
                break;
            default:
                break;
        }
    }
}

// propDefine(DataAdapter.prototype.findAll)
// propDefine(DataAdapter.prototype.save)
// propDefine(DataAdapter.prototype.delete)
// propDefine(DataAdapter.prototype.findById)

// function propDefine(that,actionName){
//     Object.defineProperties(that[actionName], {
//         'name': {writable: true},
//         'method': {writable: true},
//         'orders': {writable: true},
//         'params': {writable: true},
//         'url': {writable: true}
//     });
// }