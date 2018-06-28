<template>
    <div>
        <template v-if="isGroupForm">
            <component :is="type + '-fc-group'" v-for="item in formitems" :key="item.name" :name="item.title" :desc="item.desc">
                <component :model="formValue" :fields="item.items" :is="type + '-fc-form'" :value="value" :displayFieldFormat="displayFieldFormat"
                :column="column" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" :ref="item.name">
                    <slot name="before" slot="before"></slot>
                    <slot name="after" slot="after"></slot>
                    <slot :name="model.name" :slot="model.name" :model="model" :value="formValue[model.name]" :display="formValue[model.name + displayFieldFormat]" v-for="model in item.items"></slot>
                </component>
            </component>
        </template>
        <template v-else>
            <component :model="formValue" :fields="fields" :is="type + '-fc-form'" :column="column" :displayFieldFormat="displayFieldFormat"
            :value="value" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" ref="tiled_form">
                <slot name="before" slot="before"></slot>
                <slot name="after" slot="after"></slot>
                <slot :name="model.name" :slot="model.name" :model="model" :value="formValue[model.name]" :display="formValue[model.name + displayFieldFormat]" v-for="model in fields"></slot>
            </component>
        </template>
    </div>
</template>
<script>
import formConnector from "../formConnector/FormConnector";
import defaults from "../Defaults";

export default {
    name: "tg-form",
    extends: formConnector,
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
        }
    },
    data(){
        let isGrouped = this.fields.some(item => item.name.startsWith("group:[") === true);
        return {
            isGroupForm:isGrouped,
            formitems:this.fields.filter(item => {
                if (isGrouped) {
                    return item.name.startsWith("group:[")
                } else {
                    return true;
                }
            })
        }
    },
    mounted(){
    },
    methods: {
        validate(callback){
            for (let form in this.$refs) {
                this.$refs[form].validate(callback);
            }
        },
        validateField(prop, callback){
            for (let form in this.$refs) {
                this.$refs[form].validateField(prop, callback);
            }
        },
        resetFields(){
            for (let form in this.$refs) {
                this.$refs[form].resetFields();
            }
        }
    }
}
</script>
<style>

</style>
