export default {
    dictFilter:[function dictFilter(result){
        return result.data;
    }],
    afterFindAll:[function afterFindAll(result, findAction, params){
        return result.data;
    }],
    beforeFindAll:[function beforeFindAll(action, params, props){
        return params;
    }]
}