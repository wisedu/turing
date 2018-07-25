import utils from "./utils";
export default {
    afterFindAll:[function (result, findAction, params){
        return result.data;
    }],
    beforeFindAll:[function (action, params, props){
        return params;
    }],
    getDictData:[function (dict, params, callback) {
        let filterparams = dict.params || {};
        if (params !== undefined && params.key !== "") {
            let newparam = {};
            newparam[dict.label] = params.key;
            Object.assign(filterparams, newparam);
        }
        utils.Post(dict.url, {where:filterparams}).then(result => {
            let datas;
            try{
                let root = result.data;
                if (dict.root !== undefined) {
                    root = result.data[dict.root];
                }
                datas = root.map(item => {
                    return {
                        label: item[dict.label],
                        value: item[dict.value]
                    }
                })
                callback(datas);
            } catch (e) {
                console.error("返回数据格式有误", e, "返回结果集", result, "字典配置参数", dict);
            }
        })
    }],
    getDictTreeData:[function (dict, params, callback) {
        let filterparams = undefined;
        if (params !== undefined && params.key !== "") {
            filterparams = params;
        }
        utils.Post(dict.url, filterparams).then(result => {
            let datas;
            try{
                datas = result.data.map(item => {
                    item["label"] = item[dict.label],
                    item["value"] = item[dict.value]
                    return item;
                })
                datas = utils.toTreeData(datas, "", {ukey:"id", pkey:'parentid', toCKey:'children'})
                callback(datas);
            } catch (e) {
                console.error(e, result);
            }
        })
    }],
    getDictTreeOneData:[function (dict, params, callback) {
        utils.Post(dict.url, {"id": params.key,"checkParent": true}).then(result => {
            let datas;
            try{
                datas = result.data.map(item => {
                    item["label"] = item[dict.label],
                    item["value"] = item[dict.value]
                    return item;
                })
                datas = utils.toTreeData(datas, "", {ukey:"id", pkey:'parentid', toCKey:'children'})
                callback(datas);
            } catch (e) {
                console.error(e, result);
            }
        })
    }],
    currentType:undefined,
    validateRules:[],
    displayFieldFormat:""
}