<template>
    <component :model="formValue" :fields="fields" :is="type + '-md-form'" :column="column" :labelWidth="labelWidth" :readonly="readonly"></component>
</template>
<script>
export default {
    name: "tg-form",
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
</script>
<style>

</style>
