<template>
    <component :is="registedComponentList()" :model="model" :name="name" :value="value" :display="display" 
    :xtype="model.xtype" :options="model.options" :placeholder="model.placeholder" :required="model.required"
    :formReadonly="formReadonly" :readonly="model.readonly" :disabled="model.disabled" :params="model.params" @on-item-change="itemChange"></component>
</template>

<script>
import defaults from "../Defaults";
export default {
    name:"tg-field",
    props:{
        type:{
            type:String,
            default:function(){
                if (defaults.currentType !== undefined) {
                    return defaults.currentType;
                } else {
                    console.error("TgForm Error: type is undefined, you can set with tg-form or window['tg-turing'].defaults.currentType")
                }
            }
        },
        model: {
            type: Object,
            default: function() {
                return {};
            }
        },
        name: null,
        value: null,
        display: String,
        formReadonly: Boolean,
    },
    methods: {
        itemChange(name, value, label, model){
            this.$emit("on-item-change", this.name, value, label, this.model)
        },
        registedComponentList(){
            const defaultXtype = 'static';
            if (this.model.xtype === undefined) {
                console.warn(`Turing Field: field ${this.name}'s xtype is undefined, instead of using 'static'.`, this.model)
                return this.model.connectorItems['static']
            } else if (this.model.connectorItems[this.model.xtype] === undefined) {
                console.warn(`Turing Field: field ${this.name}'s xtype '${this.model.xtype}' is undefined, instead of using 'static'.`, this.model)
                return this.model.connectorItems['static'];
            } else {
                return this.model.connectorItems[this.model.xtype].name
            }
        }
    }
}
</script>

<style>

</style>
