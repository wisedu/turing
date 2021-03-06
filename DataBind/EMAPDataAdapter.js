import {DataAdapter} from './DataAdapter'
import axios from 'axios'
import utils from '../utils'
import {QuerySettingBuilder} from './QuerySettingBuilder'
export class EMAPDataAdapter extends DataAdapter{
    constructor(Adapter) {
        super()
        this.Adapter = Adapter;
        this.searchDefine = {};
        this.builderList = []; //searchView 中使用
        this.__baseUrl = ""; //模型路径
        // if (arguments.length >= 2) {
        //     this.load.apply(this, arguments);
        // }
    }

    view(name, params) {
        let props = name.split(":")
        let type = props[1];
        return this.Adapter(type, this.getView(props[0]), params);
    }

    load(uri, modelName, findParams) {
        var self = this;
        var url = "";
        if ([".", "/"].indexOf(uri.substring(0, 1)) > -1) {
            url = window.apiPath + uri
        } else {
            url = uri
        }
        this.__baseUrl = uri;
        return axios.get(url, {params:{"*json":1}}).then(function(res){
            var data = res.data;
            self.refresh(data, modelName, findParams);
            return self;
        })
    }

    async viewSearch(emapActionName) {
        let path;
        if (emapActionName !== undefined){
            path = window.apiPath + this.__baseUrl.replace(".do", "/" + emapActionName + ".do");
        } else {
            throw `没有传入EMAP查询动作名称。无法调用该函数`
        }
        let res = await axios.get(path, {params:{"*searchMeta":1}});
        this.searchDefine = res.data !== undefined && res.data.searchMeta !== undefined ? res.data.searchMeta : {};
        this.builderList = this.searchDefine.builderLists;
        let metas = this.searchDefine.controls.map(function(metaItem) {
            let newItem = metaItem;
            for(var prop in metaItem) {
                if (prop.indexOf(".") > -1) {
                    let temp = prop.split(".");
                    let proptype = temp[0];
                    let prop_name = temp[1];
                    if (proptype === "search") {
                        newItem[prop_name] = metaItem[prop];
                    }
                }
                switch (prop) {
                    case "optionData":
                        newItem["options"] = metaItem[prop];
                        break;
                    case "defaultValue":
                        newItem["default"] = metaItem[prop];
                        break;
                    case "url":
                        newItem.dict = {url: metaItem[prop], value:"id", label:"name"};
                        break;
                }
            }
            if (newItem.xtype === undefined) {
                newItem.xtype = "text";
            }
            return newItem;
        });
        this.searchDefine.meta = metas;
        return metas;
    }

    getIntegratedModel(uri, modelName, findParams) {
        this.__baseUrl = uri;
        var url = "";
        if ([".", "/"].indexOf(uri.substring(0, 1)) > -1) {
            url = window.apiPath + uri
        } else {
            url = uri
        }
        return axios.get(url, {params:{"*json":1}}).then(function(res){
            var hasModel = res.data.models.filter(item => item.name === modelName);
            if (hasModel.length > 0){
                var formModel = hasModel[0].controls;
                if(formModel && formModel.length>0){
                    return axios.get(utils.getContextPath() + '/sys/emapflow/definition/queryFormActions.do', {params:findParams}).then(function(resp){
                        try {
                            var result = resp.data;
                            var processModel = result.datas;
                            if(processModel && processModel.action && processModel.action.length>0 ){
                                processModel.action.forEach(function(obj){
                                    if(obj.field && obj.field.length>0){
                                        obj.field.forEach(function(field){
                                            var selectedIdx = -1;
                                            formModel.map(function(item,index){
                                                if(item.name === field.id) selectedIdx = index;
                                            });
                                            if(selectedIdx > -1){
                                                if (formModel[selectedIdx].hidden === true || field.hidden === true) {
                                                    formModel[selectedIdx].hidden = true;
                                                } else {
                                                    formModel[selectedIdx].hidden = field.hidden?JSON.parse(field.hidden):false;
                                                }
                                                
                                                formModel[selectedIdx].readonly = field.readonly?JSON.parse(field.readonly):false;
                                                formModel[selectedIdx].required = field.required?JSON.parse(field.required):false;
                                            }
                                        });
                                    }
                                });
                                return formModel;
                            }
                        } catch (e) {
                            throw e;
                        }
                    })
                }
            }
        })
    }

    refresh(data, modelName, findParams) {
        if(typeof(this.events.onLoad) === "function")data = this.events.onLoad(data);
        
        for (var index = 0; index < data.models.length; index++) {
            var element = data.models[index];

            if (element.url.lastIndexOf("_SAVE") > -1) {
                if (["http"].indexOf(element.url.substring(0, 4)) > -1) {
                    this.actions["save"].url = element.url;
                } else {
                    this.actions["save"].url = "/" + element.url;
                }
                this.actions["save"].method = "post";
                this.actions["save"].name = element.name;
            }
            if (element.url.lastIndexOf("_DELETE") > -1) {
                if (["http"].indexOf(element.url.substring(0, 4)) > -1) {
                    this.actions["delete"].url = element.url;
                } else {
                    this.actions["delete"].url = "/" + element.url;
                }
                this.actions["delete"].method = "post";
                this.actions["delete"].name = element.name;
            }
            if (element.url.lastIndexOf("_QUERY") > -1 || element.url.indexOf(modelName) > -1) {
                if (["http"].indexOf(element.url.substring(0, 4)) > -1) {
                    this.actions["findAll"].url = element.url;
                } else {
                    this.actions["findAll"].url = "/" + element.url;
                }
                this.actions["findAll"].method = "post";
                this.actions["findAll"].params = findParams || {}
                // this.actions["findAll"].params.pageSize = 10;
                // this.actions["findAll"].params.pageNumber = 1;
                this.actions["findAll"].name = element.name;
            }

            this.actions[element.name] = {
                url: "/" + element.url,
                method: "post",
                controls:element.controls,
                name: element.name
            };
            //只有指定名称下的模型，被填充到默认模型对象中，用于显示
            if(element.name == modelName){
                var controls = element.controls;
                this.loadMeta(controls);
            }
        }
        if (this.actions[modelName] !== undefined) {
            Object.assign(this.actions.findAll, this.actions[modelName]);
        }
        // if(typeof(this.events.onRefreshed) === "function")this.events.onRefreshed(this.getMeta());
    }

    loadMeta(controls) {
        if(controls === undefined || controls === null || controls.length == 0){
            console.log("传入controls为空，不做刷新处理");
            console.trace();
            return;
        }
        var category_meta = [];
        
        for (var i = 0; i < controls.length; i++) {
            var control = controls[i];
            category_meta.push(JSON.parse(JSON.stringify(control)));
        }
        if(typeof(this.events.onLoadMeta) === "function")category_meta = this.events.onLoadMeta(category_meta);
        this.initView(this.EMAPFieldFilter(category_meta));
    }

    EMAPFieldFilter(metas) {
	    var struct = {
	        "default":{
	            // name:{caption:"名称", hidden:false, format:""},
	            // status:{caption:"状态"}
	        },
	        "grid":{
	            // name:{width:"", isFixed:false},
	            // status:{}
	        },
	        "form":{
	            // name:{xtype:"", placeholder:"", options:[], default:"", JSONParam:{}, dataSize:0, checkType:"", checkSize:0, required:false, url:"", col:1},
	            // status:{}
	        },
	        "search":{
	            // name:{quickSearch:true}
	            // status:{}
	        }
        }
        
        let groupNames = [];
	    
	    metas.map(function(metaItem) {
	        var name = metaItem["name"];

	        for(var prop in metaItem) {
	        	if (struct["default"][name] === undefined)struct["default"][name] = {};
	        	if (struct["grid"][name] === undefined)struct["grid"][name] = {};
	        	if (struct["form"][name] === undefined)struct["form"][name] = {};

                if (prop === "name")continue;
                let prop_name = "";
                let proptype = "";
                if (prop.indexOf(".") > -1) {
                    let temp = prop.split(".");
                    proptype = temp[0];
                    prop_name = temp[1];
                    switch (prop_name) {
                        case "JSONParam":
                            struct[proptype][name]["params"] = metaItem[prop];
                        case "optionData":
                            struct[proptype][name]["options"] = metaItem[prop];
                        case "width":
                            struct[proptype][name][prop_name] = Number(metaItem[prop].replace("px", ""));
                            if ( isNaN(struct[proptype][name][prop_name]) === true ) {
                                delete struct[proptype][name][prop_name];
                                console.warn(name, prop_name, metaItem[prop_name], "无法转换为数值，已经被删除");
                            }
                            break;
                        default:
                            if (proptype === "search" && struct["search"][name] === undefined)struct["search"][name] = {};
                            struct[proptype][name][prop_name] = metaItem[prop];
                    }
                } else {
                    prop_name = prop;
                    switch (prop_name) {
                        case "caption":
                        case "hidden":
                        case "format":
                            struct["default"][name][prop_name] = metaItem[prop_name];
                            break;
                        case "JSONParam":
                            struct["default"][name]["params"] = metaItem[prop_name];
                        case "optionData":
                            struct["default"][name]["options"] = metaItem[prop_name];
                            break;
                        case "defaultValue":
                            struct["default"][name]["default"] = metaItem[prop_name];
                            break;
                        case "width":
                            struct["grid"][name][prop_name] = Number(metaItem[prop_name].replace("px", ""));
                            if ( isNaN(struct["grid"][name][prop_name]) === true ) {
                                delete struct["grid"][name][prop_name];
                                console.warn(name, prop_name, metaItem[prop_name], "无法转换为数值，已经被删除");
                            }
                            break;
                        case "fixed":
                            struct["grid"][name][prop_name] = metaItem[prop_name];
                            break;
                        case "dataType":
                            let type = "string";
                            switch(metaItem[prop_name]){
                                case "int":
                                case "double":
                                case "long":
                                case "short":
                                case "float":
                                case "Decimal":
                                    type = "number";
                                    break;
                                case "boolean":
                                    type = "boolean";
                                    break;
                                // case "Date":
                                // case "Timestamp":
                                // case "Time":
                                //     type = "date";
                                    break;
                            }
                            struct["form"][name][prop_name] = type;
                            break;
                        case "xtype":
                        case "required":
                        case "readonly":
                        case "col":
                        case "placeholder":
                        case "options":
                        case "default":
                            struct["form"][name][prop_name] = metaItem[prop_name];
                            break;
                        case "checkType":
                            if (struct["form"][name]["validator"] === undefined){
                                struct["form"][name]["validator"] = {};
                            }
                            let checkType = metaItem[prop_name].replace(/\[|\]|\"|\{|\}|custom/g, "");
                            struct["form"][name]["validator"][prop_name] = checkType;
                            struct["form"][name]["validator"]["trigger"] = "blur";
                            break;
                        case "dataSize":
                        case "checkSize":
                        case "checkExp":
                            if (struct["form"][name]["validator"] === undefined){
                                struct["form"][name]["validator"] = {};
                            }
                            struct["form"][name]["validator"][prop_name] = metaItem[prop_name];
                            struct["form"][name]["validator"]["trigger"] = "blur";
                            break;
                        case "groupName":
                            if (prop_name === "groupName") {
                                if (groupNames.indexOf(metaItem[prop_name]) === -1) {
                                    groupNames.push(metaItem[prop_name]);
                                }
                            }
                            struct["form"][name][prop_name] = metaItem[prop_name];
                            break;
                        case "url":
                            struct["form"][name].dict = {url: metaItem[prop_name], value:"id", label:"name"};
                            if (metaItem.quickSearch === true) {
                                if (struct["search"][name] === undefined)struct["search"][name] = {};
                                struct["search"][name].dict = {url: metaItem[prop_name], value:"id", label:"name"};
                            }
                            break;
                        case "quickSearch":
                            if (struct["search"][name] === undefined)struct["search"][name] = {};
                            struct["search"][name][prop_name] = metaItem[prop_name];
                            break;
                        default:
                            break;
                    }
                }
            }
        })
        
        if (groupNames.length > 0) {
            let newForm = {};
            groupNames.map(group => {
                let newItem = newForm[`group:[${group}]`] = {
                    // desc:"~个人基本信息~",
                    items:{}
                };
                for (let key in struct["form"]) {
                    let item = struct["form"][key];
                    if (item.groupName === group) {
                        newItem.items[key] = item;
                    }
                }
            })
            struct["form"] = newForm;
        }
        // console.log(struct);

	    return struct;
    }
    
    querySettingBuilder = QuerySettingBuilder.lite

    // view(name, params) {
    //     let props = name.split(":")
    //     let type = props[1];
    //     return tgTuringAntd.Adapter(type, this.getView(name), params);
    // }

    onFetching(status, result) {
        switch (status) {
            case "doing-string":
                this.__doingUrl = this.__baseUrl.replace(".do", "/" + this.__doingUrl + ".do");
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