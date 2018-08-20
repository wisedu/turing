import defaults from "../Defaults";
export default {
    props:{
        fields:Array,
        value: { type: Object, default () { return {}; } },
        displayFieldFormat:{
            type:String,
            default:function(){
                if (defaults.displayFieldFormat !== undefined) {
                    return defaults.displayFieldFormat;
                } else {
                    console.error("TgForm Error: type is undefined, you can set with tg-form or window['tg-turing'].defaults.displayFieldFormat")
                }
            }
        },
        column:Number,
        labelWidth:{
            type:Number,
            default:100
        },
        readonly:Boolean,
        validateRules: [Object, Array]
    },
    data(){
        return {
            formDisplay: {},
            optionsMap: {},
            formValue: this.value
        }
    },
    watch:{
        value: {
            handler: function(newValue){
                this.formValue = newValue;
            },
            deep: true
        }
    },
    methods:{
        registedComponentList(model, connectorItems, defaultXtype, index){
            let xtype = model.xtype;
            let caption = model.caption;
            if (xtype === undefined) {
                console.warn(`Turing FormConnector: field ${caption}'s xtype is undefined, instead of using 'static'.`, model, index)
                return connectorItems['static'].name
            } else if (connectorItems[xtype] === undefined) {
                console.warn(`Turing FormConnector: field ${caption}'s xtype '${xtype}' is undefined, instead of using '${defaultXtype}'.`, model, index)
                return connectorItems[defaultXtype].name;
            } else {
                return connectorItems[xtype].name
            }
        },
        updateValue(name, value, display, model){
            if (value === null) value = "";
            if (value === "") {
                this.$delete(this.formValue, name);
                this.$delete(this.formDisplay, name);
            } else {
                this.$set(this.formValue, name, value);
                if (display !== undefined) {
                    this.formDisplay[name] = display;
                }
            }
            this.$emit("on-value-change", name, value, display, model, this.formValue);
            this.$emit("input", this.formValue)
        },
        getValue(name){
            if (name === undefined) {
                return this.formValue;
            } else {
                return this.formValue[name];
            }
        },
        getDisplay(name){
            if (name === undefined) {
                return this.formDisplay;
            } else {
                return this.formDisplay[name];
            }
        }
    }
}