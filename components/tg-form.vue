<template>
    <component :model="formValue" :fields="fields" :is="type + '-fc-form'" :column="column" :labelWidth="labelWidth" :readonly="readonly"></component>
</template>
<script>
import formConnector from "../formConnector/FormConnector";
export default {
    name: "tg-form",
    extends: formConnector,
    props:{
        type:String
    }
}
</script>
<style>

</style>
