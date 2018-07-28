<template>
    <div class="tg-form-wrap">
        <template v-if="isGroupForm">
            <component :is="type + '-fc-group'" v-for="item in groupedFields" :key="item.name" :name="item.title" :desc="item.desc">
                <component :model="formValue" :fields="item.items.filter(item => item.hidden !== true)" :is="type + '-fc-form'" :value="value" :displayFieldFormat="displayFieldFormat"
                :column="column" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" :ref="item.name" :validateRules="groupedRules[item.name]">
                    <slot name="before" slot="before"></slot>
                    <slot name="after" slot="after"></slot>
                    <slot :name="model.name" :slot="model.name" :model="model" :value="formValue[model.name]" :display="formValue[model.name + displayFieldFormat]" v-for="model in item.items"></slot>
                </component>
            </component>
        </template>
        <template v-else>
            <component :model="formValue" :fields="tiledFields" :is="type + '-fc-form'" :column="column" :displayFieldFormat="displayFieldFormat"
            :value="value" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" :validateRules="tiledRules" ref="tiled_form">
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
    data() {
        return {
            tiledRules: {},
            groupedRules: {},
            isGroupForm: false,
            groupedFields: [],
            tiledFields: []
        }
    },
    watch:{
        fields:{
            handler:function(newValue){
                this.refresh(newValue);
            },
            deep: true
        }
    },
    created(){
        this.refresh(this.fields);
    },
    methods: {
        refresh(newValue){
            this.isGroupForm = newValue.some(item => item.name.startsWith("group:[") === true);
            let rules = {};
            if (this.isGroupForm === true) {
                this.groupedFields = newValue.filter(group => {
                    let isGrouped = group.name.startsWith("group:[");
                    if (isGrouped) {
                        //校验
                        let rules = {};
                        let newFields = group.items.filter(item => {
                            this.getValidateRules(item, rules);
                            return item.hidden !== true;
                        });
                        this.groupedRules[group.name] = rules;
                        //
                    }
                    return isGrouped;
                })
                this.$emit("update:validateRules", this.groupedRules);
            } else {
                this.tiledFields = newValue.filter(item => {
                    this.getValidateRules(item, rules);
                    return item.hidden !== true;
                });
                this.tiledRules = rules;
                this.$emit("update:validateRules", this.tiledRules)
            }
        },
        validate(callback){
            for (let form in this.$refs) {
                if (this.isGroupForm === true) {
                    this.$refs[form][0].validate(callback);
                } else {
                    this.$refs[form].validate(callback);
                }
            }
        },
        validateField(prop, callback){
            for (let form in this.$refs) {
                if (this.isGroupForm === true) {
                    this.$refs[form][0].validateField(prop, callback);
                } else {
                    this.$refs[form].validateField(prop, callback);
                }
            }
        },
        resetFields(){
            for (let form in this.$refs) {
                this.$refs[form].resetFields();
            }
        },
        getValidateRules(item, rules) {
            if (item.required === true && item.hidden !== true) {
                if (rules[item.name] === undefined){
                    rules[item.name] = [];
                }
                rules[item.name].push({
                    required: true, trigger: 'blur', message: `不能为空`
                });
            }
        }
    }
}

</script>
<style>
.tg-form-wrap{}
</style>
