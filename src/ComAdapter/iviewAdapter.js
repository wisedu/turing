export default function(type, model, params){
    let iviewModel = [];
    switch (type) {
        case "table":
            for(let prop in model){
                if (model[prop].hidden === true){
                    continue;
                }
                let newTableItem = Object.assign({}, model[prop], {
                    title:model[prop].caption, 
                    key:prop, 
                    minWidth:120
                }, params);
                iviewModel.push(newTableItem);
            }
            break;
        case "form":
            for(let prop in model){
                let newFormItem = Object.assign({}, model[prop], {
                    name:prop, 
                }, params);
                if (model[prop].xtype !== undefined && model[prop].options === undefined){
                    model[prop].options = [];
                }
                iviewModel.push(newFormItem);
            }
            break;
        default:
            break;
    }
    
    return iviewModel;
}