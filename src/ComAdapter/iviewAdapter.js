export default function(type, model){
    let iviewModel;
    switch (type) {
        case "table":
            iviewModel = [];
            for(let prop in model){
                iviewModel.push({title:model[prop].caption, key:prop});
            }
            // model.map(item => {
            //     iviewModel.push({title:item[1].caption, key:item[0]});
            // })
            break;
    
        default:
            break;
    }
    return iviewModel;
}