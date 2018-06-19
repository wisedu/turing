import utils from "./utils";
export default {
    afterFindAll:[function (result, findAction, params){
        return result.data;
    }],
    beforeFindAll:[function (action, params, props){
        return params;
    }],
    getDictData:[function (dict, callback) {
        utils.Get(dict.url).then(result => {
            let datas;
            try{
                datas = result.data.map(item => {
                    return {
                        label: item[dict.label],
                        value: item[dict.value]
                    }
                })
                callback(datas);
            } catch (e) {
                console.error(e, result, this.dictFilter[0], datas);
            }
        })
    }],
}