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
        this.__static_orders = [];
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
    execute(action, data, paramReduce){
        let prCallback = paramReduce || this.executeParamReduce;
        var url = "";
        var params = Object.assign({}, action.params, data || {})
        if ([".", "/"].indexOf(action.url.substring(0, 1)) > -1) {
            url = (window.apiPath || '') + action.url
        } else {
            url = action.url
        }
        if (action.method.toLowerCase() === "post") {
            if (prCallback !== undefined) {
                params = prCallback("post", params, this.__includes, this.__orders, this.pageNumber, this.pageSize)
            } else {
                params = {where: params};
                if (this.__includes !== undefined && this.__includes.length > 0) {
                    params["include"] = this.__includes;
                }

                params["order"] = this.__static_orders.concat(this.__orders);
                if (params["order"].length == 0) {
                    delete params.order;
                }

                params["offset"] = (this.pageNumber - 1) * this.pageSize;
                params["limit"] = this.pageSize;
            }
            return axios.post(url, params)
        } else if (action.method.toLowerCase() === "delete") {
            //删除资源仅允许与rest接口约定的url方式
            return axios.delete(url)
        }else {
            if (prCallback !== undefined) {
                params = prCallback("get", params, this.__includes, this.__orders, this.pageNumber, this.pageSize)
            }
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
            url:"",
            method:"post",
            name:""
        },
        delete:{
            url:"",
            method:"post",
            name:""
        },
        find:{
            url:"",
            method:"post",
            name:""
        }
    }

    findAll(param, resultReduce) {
        let reCallback = resultReduce || this.findAllResultReduce;
        var that = this;
        return this.execute(this.actions.find, param).then(function(result){
            if (reCallback !== undefined) {
                return reCallback(result.data, that.actions.find);
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
     * @description 包含关联表
     * @example ["table1","table2"]
     * @param {[]} tabNames 
     */
    include(tabNames){
        this.__includes = tabNames;
    }
    staticOrder(fields){
        this.__static_orders = fields;
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