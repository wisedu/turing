import utils from '../utils.js';
import axios from 'axios'

export class DataAdapter {
    constructor(meta) {
        this.__meta = meta;
        this.viewDefine;
        this.__orders = [];
        this.pageNumber = 1;
        this.pageSize = 100;
    }
    getView(viewId) {
        let views = this.viewDefine;
        let result = {}
        for(let prop in views[viewId]) {
            result[prop] = {};
            //如果有分组，则循环分组中的items
            if (prop.startsWith("group:[")) {
                let newGroupItem = {}
                let groupItems = views[viewId][prop].items;
                for(let item in groupItems){
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
    initView(views){
        this.viewDefine = views;
    }
    execute(action, data){
        var url = "";
        var params = data || action.params;
        if ([".", "/"].indexOf(action.url.substring(0, 1)) > -1) {
            url = (window.apiPath || '') + action.url
        } else {
            url = action.url
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

        if (action.method === "post") {
            return axios.post(url, params)
        } else if (action.method === "delete") {
            //删除资源仅允许与rest接口约定的url方式
            return axios.delete(url)
        }else {
            return axios.get(url, {params: params})
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
        find:{
            url: "",
            method: "post",
            name: "",
            params: {},
            orders: [],
        }
    }
    
    querySetting = undefined

    findAll(param) {
        let bfCallback = this.beforeFindAll;
        let afCallback = this.afterFindAll;
        var that = this;
        
        let defaultParams = {
            where: utils.extend(true, {}, this.actions.find.params, param || {})
        };
        
        defaultParams["order"] = this.actions.find.orders.concat(this.__orders);
        if (defaultParams["order"].length == 0) {
            delete defaultParams.order;
        }

        defaultParams["offset"] = (this.pageNumber - 1) * this.pageSize;
        defaultParams["limit"] = this.pageSize;

        if (bfCallback !== undefined) {
            defaultParams = bfCallback(this.actions.find, defaultParams, {
                pageNumber: this.pageNumber, 
                pageSize: this.pageSize
            });
        }

        return this.execute(this.actions.find, defaultParams).then(function(result){
            if (afCallback !== undefined) {
                return afCallback(result.data, that.actions.find);
            } else {
                return result.data;
            }
        });
    }
    findById(params) {
        var that = this;
        return this.execute(this.actions.findById, params).then(function(result){
            return result.data;
        });
    }
    delete(params) {
        var that = this;
        return this.execute(this.actions.delete, params).then(function(result){
            return result.data;
        });
    }
    save(data) {
        var that = this;
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
}