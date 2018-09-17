export default{
    props:{
        model: {
            type: Object,
            default: function() {
                return {};
            }
        },
        caption: String,
        name: String,
        value: null,
        display: null,
        xtype: String,
        options: {
            type:Array,
            default(){
                return []
            }
        },
        placeholder: String,
        required: Boolean,
        formReadonly: Boolean,
        readonly: Boolean,
        disabled: Boolean,
        params: {
            type:Object, 
            default(){
                return {}
            }
        },
        loaddata: Function
    },
}