import {DataAdapter} from './DataAdapter'
import axios from 'axios'
export class EMAPDataAdapter extends DataAdapter{
    constructor(Adapter) {
        super()
        this.Adapter = Adapter;
        // if (arguments.length >= 2) {
        //     this.load.apply(this, arguments);
        // }
    }

    view(name, params) {
        let props = name.split(":")
        let type = props[1];
        return this.Adapter(type, this.getView(props[0]), params);
    }

    load(uri, modelName, findParams){
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

    refresh(data, modelName, findParams) {
        if(typeof(this.events.onLoad) === "function")data = this.events.onLoad(data);
        
        for (var index = 0; index < data.models.length; index++) {
            var element = data.models[index];

            if (element.url.indexOf("_SAVE") > -1) {
                if (["http"].indexOf(element.url.substring(0, 4)) > -1) {
                    this.actions["save"].url = element.url;
                } else {
                    this.actions["save"].url = "./" + element.url;
                }
                this.actions["save"].method = "post";
                this.actions["save"].name = element.name;
            }
            if (element.url.indexOf("_DELETE") > -1) {
                if (["http"].indexOf(element.url.substring(0, 4)) > -1) {
                    this.actions["delete"].url = element.url;
                } else {
                    this.actions["delete"].url = "./" + element.url;
                }
                this.actions["delete"].method = "post";
                this.actions["delete"].name = element.name;
            }
            if (element.url.indexOf("_QUERY") > -1 || element.url.indexOf(modelName) > -1) {
                if (["http"].indexOf(element.url.substring(0, 4)) > -1) {
                    this.actions["find"].url = element.url;
                } else {
                    this.actions["find"].url = "./" + element.url;
                }
                this.actions["find"].method = "post";
                this.actions["find"].params = findParams || {}
                // this.actions["find"].params.pageSize = 10;
                // this.actions["find"].params.pageNumber = 1;
                this.actions["find"].name = element.name;
            }

            this.actions[element.name] = {
                url: element.url,
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
                    struct[proptype][name][prop_name] = metaItem[prop_name];
                } else {
                    prop_name = prop;
                    switch (prop_name) {
                        case "caption":
                        case "hidden":
                        case "format":
                            struct["default"][name][prop_name] = metaItem[prop_name];
                            break;
                        case "width":
                        case "fixed":
                            struct["grid"][name][prop_name] = metaItem[prop_name];
                            break;
                        case "xtype":
                        case "required":
                        case "col":
                        case "placeholder":
                        case "options":
                        case "default":
                        case "dataSize":
                        case "checkType":
                        case "checkSize":
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
                            break;
                        case "JSONParam":
                            struct["form"][name]["params"] = metaItem[prop_name];
                        case "optionData":
                            struct["form"][name]["options"] = metaItem[prop_name];
                            break;
                        case "defaultValue":
                            struct["form"][name]["default"] = metaItem[prop_name];
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

	    return struct;
    }
    
    querySettingBuilder(params) {
        if (Object.keys(params).length > 0 && !params.querySetting) {
            var query = [];
            for (var key in params) {
                query.push({
                    name: key,
                    value: params[key],
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