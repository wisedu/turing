<template>
    <component :is="type + '-fc-' + model.xtype" :model="model" :caption="model.caption" :name="model.name" :value="value"
    :display="display" :xtype="model.xtype" :options="model.options" :placeholder="model.placeholder" :required="model.required"
    :formReadonly="formReadonly" :readonly="model.readonly" :disabled="model.disabled" :params="model.params"></component>
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
}
</script>

<style>

</style>
