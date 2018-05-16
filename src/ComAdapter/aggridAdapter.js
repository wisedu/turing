import utils from '../utils.js';
export default function(type, model, params){
    let iviewModel = [];
    switch (type) {
        case "table":
            for(let prop in model){
                if (model[prop].hidden === true){
                    continue;
                }
                let newTableItem = Object.assign({}, model[prop], {
                    headerName:model[prop].caption, 
                    field:prop, 
                    minWidth:120
                }, params);
                iviewModel.push(newTableItem);
            }
            break;
        default:
            break;
    }
    
    return iviewModel;
}