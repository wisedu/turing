import utils from '../../src/utils.js';
export default function(type, model, params){
    let iviewModel = [];
    switch (type) {
        case "table":
            for(let prop in model){
                if (model[prop].hidden === true){
                    continue;
                }
                let newTableItem = utils.extend({}, {
                    title:model[prop].caption, 
                    key:prop, 
                    minWidth:120
                }, model[prop], params);
                if (newTableItem.dict !== undefined && newTableItem.dict.display !== undefined) {
                    newTableItem["key"] = newTableItem.dict.display;
                }
                if (newTableItem.filters !== undefined){
                    newTableItem.filterRemote = function(value,key,column) {
                        column.selectedFilterValue = value;
                    }
                }
                iviewModel.push(newTableItem);
            }
            break;
        case "form":
            for(let prop in model){
                let newFormItem = utils.extend({}, {
                    name:prop, 
                }, model[prop], params);
                if (model[prop].xtype !== undefined && model[prop].options === undefined){
                    model[prop].options = [];
                }
                iviewModel.push(newFormItem);
            }
            break;
        case "tree":
            let datas = model;
            let root = params.root;
            model.map(item => {
                item.title = item[params.label]
            })
            delete params.label;
            delete params.root;
            iviewModel = utils.toTreeData(datas, root, utils.extend({toCKey:'children'}, params))
            break;
        case "dict":
            
            break;
        default:
            break;
    }
    
    return iviewModel;
}