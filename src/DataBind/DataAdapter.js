import utils from '../utils.js';
import axios from 'axios'

if (typeof Object.assign != 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target == null) { // TypeError if undefined or null
          throw new TypeError('Cannot convert undefined or null to object');
        }
  
        var to = Object(target);
  
        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];
  
          if (nextSource != null) { // Skip over if undefined or null
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
}
  
export class DataAdapter {
    
    constructor(meta) {
        this.__meta = meta;
        this.defaultMeta;
        this.__includes = [];
        this.__orders = [];
        this.pageNumber = 1;
        this.pageSize = 10;
    }
    getMeta(metaid) {
        let struct = this.defaultMeta;
        let result = {}
        for(let prop in struct[metaid]) {
            result[prop] = {};
            Object.assign(result[prop], struct["default"][prop], struct[metaid][prop]);
        }
        return result;
    }
    setMeta(metas){
        this.defaultMeta = metas;
    }
    execute(action, data){
        var url = "";
        var params = data || action.params;
        if ([".", "/"].indexOf(action.url.substring(0, 1)) > -1) {
            url = (window.apiPath || '') + action.url
        } else {
            url = action.url
        }
        if (action.method.toLowerCase() === "post") {
            return axios.post(url, params)
        } else if (action.method.toLowerCase() === "delete") {
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
        find:{
            url: "",
            method: "post",
            name: "",
            params: {},
            orders: [],
            include: []
        }
    }

    findAll(param) {
        let bfCallback = this.beforeFindAll;
        let afCallback = this.afterFindAll;
        var that = this;
        
        let defaultParams = {
            where: Object.assign({}, this.actions.find.params, param || {})
        };
        if (this.actions.find.include.length > 0) {
            defaultParams["include"] = this.actions.find.include;
        }

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

    findById() {

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