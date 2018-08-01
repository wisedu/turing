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
        let isGroupForm = _isGrouped(this.fields);
        let fields_and_rules = {};
        let tiledRules = {};
        let groupedRules = {};
        let groupedFields = [];
        let tiledFields = [];
        if (isGroupForm === true) {
            fields_and_rules = _getGroupdFieldsAndRules(this.fields);
            groupedFields = fields_and_rules.fields;
            groupedRules = fields_and_rules.rules;
            if (this.validateRules !== undefined) {
                groupedRules = this.validateRules;
            }
        } else {
            fields_and_rules = _getTiledFieldsAndRules(this.fields);
            tiledFields = fields_and_rules.fields;
            tiledRules = fields_and_rules.rules;
            if (this.validateRules !== undefined) {
                tiledRules = this.validateRules;
            }
        }
        
        return {
            tiledRules: tiledRules,
            groupedRules: groupedRules,
            isGroupForm: _isGrouped(this.fields),
            groupedFields: groupedFields,
            tiledFields: tiledFields
        }
    },
    watch:{
        fields:{
            handler:function(newValue){
                this.refresh(newValue);
            }
        }
    },
    methods: {
        refresh(newValue){
            this.isGroupForm = _isGrouped(this.fields);
            if (this.isGroupForm === true) {
                let fields_and_rules = _getGroupdFieldsAndRules(newValue);
                this.groupedFields = fields_and_rules.fields;
                this.groupedRules = fields_and_rules.rules;
                this.$emit("update:validateRules", this.groupedRules);
            } else {
                let fields_and_rules = _getTiledFieldsAndRules(newValue);
                this.tiledFields = fields_and_rules.fields;
                this.tiledRules = fields_and_rules.rules;
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
        }
    }
}

function _getValidateRules(field, rules) {
    if (field.required !== undefined && field.hidden !== true) {
        if (rules[field.name] === undefined){
            rules[field.name] = [];
        }
        let required = defaults[defaults.currentType].form[field.xtype || "static"].required;
        if (required !== undefined) {
            required.required = true;
            rules[field.name].push(required);
        }
    }
    if (field.vaildator !== undefined && field.hidden !== true) {
        if (rules[field.name] === undefined){
            rules[field.name] = [];
        }
        rules[field.name] = rules[field.name].concat(field.vaildator);
    }
}

function _isGrouped(fields) {
    return fields.some(item => item.name.startsWith("group:[") === true)
}

function _getGroupdFieldsAndRules(fields) {
    let groupedRules = {};
    let groupedFields = fields.filter(group => {
        let isGrouped = group.name.startsWith("group:[");
        if (isGrouped) {
            //校验
            let rules = {};
            group.items.map(item => {
                if (item.hidden !== true) {
                    _getValidateRules(item, rules);
                }
            });
            groupedRules[group.name] = rules;
            //
        }
        return isGrouped;
    });
    return {fields:groupedFields, rules:groupedRules};
}

function _getTiledFieldsAndRules(fields) {
    let tiledRules = {};
    let tiledFields = fields.filter(item => {
        if (item.hidden !== true) {
            _getValidateRules(item, tiledRules);
        }
        return item.hidden !== true;
    });
    return {fields:tiledFields, rules:tiledRules};
}

</script>
<style>
.tg-form-wrap{}
</style>
