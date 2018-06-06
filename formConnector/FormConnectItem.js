export default{
    props:{
        model: {
            type: Object,
            default: function() {
                return {};
            }
        },
        caption: String,
        value: null,
        display: String,
        xtype: String,
        options: {
            type:Array,
            default(){
                return []
            }
        },
        placeholder: String,
        required: Boolean,
        readonly: Boolean,
        disabled: Boolean,
        params: {
            type:Object, 
            default(){
                return {}
            }
        }
    },
}