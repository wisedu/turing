<template>
    <component :fields="fields" :is="type + '-md-form'"></component>
</template>
<script>
export default {
    name: "tg-form",
    props:{
        fields:Array,
        type:String
    }
}
</script>
<style>

</style>
