import {DataAdapter} from './DataAdapter'
import axios from 'axios'
import utils from '../utils'
export class EMAPDataAdapter extends DataAdapter{
    constructor(Adapter) {
        super()
        this.Adapter = Adapter;
        this.searchDefine = {};
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
        return axios.get(url, {params:{"*json":1}}).then(function(res){
            var data = res.data;
            self.refresh(data, modelName, findParams);
            return self;
        })
    }

    async getSearchView(url) {
        let path;
        if (url !== undefined){
            path = url;
        } else {
            path = this.actions.findAll.url;
        }
        if (path === undefined || path === null || path === "") {
            throw `没有传入url，也没有默认的findAll.url。无法调用该函数`
        }
        let res = await axios.get(path, {params:{"*searchMeta":1}});
        this.searchDefine = res.data !== undefined && res.data.searchMeta !== undefined ? res.data.searchMeta : {};

        return this.searchDefine;
    }

    getIntegratedModel(uri, modelName, findParams) {
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
                method: "post"
            };
            //只有指定名称下的模型，被填充到默认模型对象中，用于显示
            if(element.name == modelName){
                var controls = element.controls;
                this.loadMeta(controls);
            }
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
	        	if (struct["search"][name] === undefined)struct["search"][name] = {};

                if (prop === "name")continue;
                let prop_name = "";
                let proptype = "";
                if (prop.indexOf(".") > -1) {
                    let temp = prop.split(".");
                    proptype = temp[0];
                    prop_name = temp[1];
                    struct[proptype][name][prop_name] = metaItem[prop];
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
                        case "fixed":
                            struct["grid"][name][prop_name] = metaItem[prop_name];
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
                        case "dataSize":
                        case "checkType":
                        case "checkSize":
                            // struct["form"][name]["vaildator"] = metaItem[prop_name];
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
                            struct["search"][name].dict = {url: metaItem[prop_name], value:"id", label:"name"};
                            break;
                        case "quickSearch":
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
    
    querySettingBuilder(params) {
        if (Object.keys(params).length > 0 && !params.querySetting) {
            var query = [];
            for (var key in params) {
                let value = params[key];
                if (Array.isArray(value)){
                    value = value.join(",");
                }
                query.push({
                    name: key,
                    value: value,
                    linkOpt: 'OR',
                    builder: 'include'
                });
            }
            return JSON.stringify(query);
        } else {
            return undefined;
        }
    }

    // view(name, params) {
    //     let props = name.split(":")
    //     let type = props[1];
    //     return tgTuringAntd.Adapter(type, this.getView(name), params);
    // }
}