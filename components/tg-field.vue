<template>
    <component :is="type + '-fc-' + model.xtype" :model="model" :name="name" :value="value" :display="display" 
    :xtype="model.xtype" :options="model.options" :placeholder="model.placeholder" :required="model.required"
    :formReadonly="formReadonly" :readonly="model.readonly" :disabled="model.disabled" :params="model.params" @on-item-change="itemChange"></component>
</template>

<script>
export default {
    name:"tg-field",
    props:{
        type:String,
        model: {
            type: Object,
            default: function() {
                return {};
            }
        },
        value: null,
        display: String,
        formReadonly: Boolean,
    },
    methods: {
        itemChange(name, value, label, model){
            this.$emit("on-item-change", this.name, value, label, this.model)
        }
    }
}
</script>

<style>

</style>
