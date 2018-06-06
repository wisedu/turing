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
    methods:{
        handleSyncChange(val, name) {
            this.$set(this.formValue, name, val);
        },
        registedComponentList(model, connectorItems, defaultXtype, index){
            let xtype = model.xtype;
            let caption = model.caption;
            if (xtype === undefined) {
                console.warn(`Turing FormConnector: field ${caption}'s xtype is undefined, instead of using 'static'.`, model, index)
                return connectorItems['static']
            } else if (connectorItems[xtype] === undefined) {
                console.warn(`Turing FormConnector: field ${caption}'s xtype '${xtype}' is undefined, instead of using '${defaultXtype}'.`, model, index)
                return defaultXtype;
            } else {
                return connectorItems[xtype]
            }
        },
        updateValue(name, value){
            this.formValue[name] = value;
            this.$emit("onValueChange", this.formValue, name, value);
        }
    }
}