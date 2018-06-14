<template>
    <component :is="type + '-fc-' + xtype" :model="model" :caption="caption" :name="name" :value="value"
    :display="display" :xtype="xtype" :options="options" :placeholder="placeholder" :required="required"
    :formReadonly="formReadonly" :readonly="readonly" :disabled="disabled" :params="params"></component>
</template>

<script>
import connectItem from "../formConnector/ConnectItem";
export default {
    name:"tg-field",
    extends:connectItem,
    props:{
        type:String,
    },
}
</script>

<style>

</style>
