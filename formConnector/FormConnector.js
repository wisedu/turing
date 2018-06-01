export default {
    props:{
        fields:Array,
        value: { type: Object, default () { return {}; } },
        column:Number,
        labelWidth:{
            type:Number,
            default:100
        },
        readonly:Boolean
    },
    data(){
        return {
            formValue:this.value,
            optionsMap: {}
        }
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.formValue = val;
            }
        },
        formValue: {
            deep: true,
            handler(val) {
                this.$emit('input', val);
            }
        },
    },
    methods:{
        handleSyncChange(val, name) {
            this.$set(this.formValue, name, val);
        },
    }
}