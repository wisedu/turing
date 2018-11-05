export class QuerySettingBuilder{
    constructor(){

    }
    static EMAP(){

    }
    static lite(params) {
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
    static sequelize(searchValues, defaultScope, ignoreEmpty){
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
}