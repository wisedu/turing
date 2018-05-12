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
    __meta;
    defaultMeta;
    rootKey;
    id;
    constructor(meta) {
        this.__meta = meta;
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
        var params = Object.assign({}, action.params, data || {})
        if ([".", "/"].indexOf(action.url.substring(0, 1)) > -1) {
            url = (window.apiPath || '') + action.url
        } else {
            url = action.url
        }
        if (action.method.toLowerCase() === "post") {
            return axios.post(url, params)
        } else {
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
            method:"get",
            name:""
        }
    }

    findAll(param, rootKey) {
        let rk = rootKey || this.rootKey;
        var that = this;
        return this.execute(this.actions.find, param).then(function(result){
            if (rk !== undefined) {
                if (rk.toLowerCase() === "emap") {
                    return result.data.datas[that.actions.find.name];
                } else {
                    return result.data[rk];
                }
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
}