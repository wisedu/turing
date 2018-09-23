<template>
    <div class="tg-form-wrap">
        <form ref="syncForm" :action="syncPostUrl" target="localFrame" method="POST" enctype="multipart/form-data">
            <input type="hidden" v-for="item in syncFields" :key="item.key" :name="item.key" :value="item.value">
            <template v-if="isGroupForm">
                <component :is="type + '-fc-group'" v-for="item in groupedFields" :key="item.name" :name="item.title" :desc="item.desc">
                    <component :model="formValue" :fields="item.items.filter(item => item.hidden !== true)" :is="type + '-fc-form'" :value="value" :displayFieldFormat="displayFieldFormat"
                    :loaddata="loaddata" :column="column" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" :ref="item.name" :validateRules="groupedRules[item.name]">
                        <slot name="before" slot="before"></slot>
                        <slot name="after" slot="after"></slot>
                        <slot :name="model.name" :slot="model.name" :model="model" :value="formValue[model.name]" :display="formValue[model.name + displayFieldFormat]" v-for="model in item.items"></slot>
                    </component>
                </component>
            </template>
            <template v-else>
                <component :model="formValue" :fields="tiledFields" :is="type + '-fc-form'" :column="column" :displayFieldFormat="displayFieldFormat" :loaddata="loaddata"
                :value="value" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" :validateRules="tiledRules" ref="tiled_form">
                    <slot name="before" slot="before"></slot>
                    <slot name="after" slot="after"></slot>
                    <slot :name="model.name" :slot="model.name" :model="model" :value="formValue[model.name]" :display="formValue[model.name + displayFieldFormat]" v-for="model in fields"></slot>
                </component>
            </template>
        </form>
        <iframe name="localFrame" style="height:0"></iframe>
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
            this.$emit("update:validateRules", groupedRules);
        } else {
            fields_and_rules = _getTiledFieldsAndRules(this.fields);
            tiledFields = fields_and_rules.fields;
            tiledRules = fields_and_rules.rules;
            if (this.validateRules !== undefined) {
                tiledRules = this.validateRules;
            }
            this.$emit("update:validateRules", tiledRules)
        }
        
        return {
            tiledRules: tiledRules,
            groupedRules: groupedRules,
            isGroupForm: _isGrouped(this.fields),
            groupedFields: groupedFields,
            tiledFields: tiledFields,
            syncPostUrl:"",
            syncFields: []
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
        submit(url){
            let that = this;
            this.syncPostUrl = url;
            this.syncFields = [];
            for (let key in this.formValue){
                this.syncFields.push({key:key,value:this.formValue[key]})
            }
            return new Promise((resolve, reject) => {
                function feedback(messageEvent) {
                    var data = messageEvent.data;// messageEvent: {source, currentTarget, data}
                    console.info('message from child:', data);
                    removeFeedback();
                    resolve(data);
                }
                function removeFeedback(){
                    window.removeEventListener('message', feedback, false);
                }
                window.addEventListener('message', feedback, false);
                
                that.$nextTick(()=>{
                    that.$refs.syncForm.submit();
                })
            });
        },
        validate(callback){
            if (this.isGroupForm === true) {
                var proms = [];
                for (let form in this.$refs) {
                    if (this.$refs[form] === undefined)continue;
                    let group_rules = this.groupedRules[form];
                    _removeRequiredFalseRule(group_rules);
                    proms.push(new Promise((resolve, reject) => {
                        this.$refs[form][0].validate((valid) => {
                            resolve(valid);
                        });
                    }));
                }
                Promise.all(proms).then(function(values){
                    let result = true;
                    values.map(item => {
                        result = result && item;
                    })
                    callback(result);
                });
            } else {
                _removeRequiredFalseRule(this.tiledRules);
                this.$refs.tiled_form.validate(callback);
            }
        },
        validateField(prop, callback){
            if (this.isGroupForm === true) {
                for (let form in this.$refs) {
                    if (this.$refs[form] === undefined)continue;
                    let group_rules = this.groupedRules[form];
                    _removeRequiredFalseRule(group_rules);
                    this.$refs[form][0].validateField(prop, callback);
                }
            } else {
                _removeRequiredFalseRule(this.tiledRules);
                this.$refs.tiled_form.validateField(prop, callback);
            }
        },
        resetFields(){
            if (this.isGroupForm === true) {
                for (let form in this.$refs) {
                    if (this.$refs[form] === undefined)continue;
                    this.$refs[form].resetFields();
                }
            } else {
                this.$refs.tiled_form.resetFields();
            }
        },
        getField(key){
            let field_model;
            if (this.isGroupForm === true) {
                for (let i in this.groupedFields) {
                    let group = this.groupedFields[i];
                    field_model = group.items.find(item => item.name === key);
                    if (field_model !== undefined) {
                        return field_model;
                    }
                }
            } else {
                field_model = this.tiledFields.find(item => item.name === key);
            }
            return field_model;
        }
    }
}

function _getValidateRules(field, rules) {
    if (field.required !== undefined && field.hidden !== true) {
        if (rules[field.name] === undefined){
            rules[field.name] = [];
        }
        let xtype = defaults[defaults.currentType].form[field.xtype || "static"]; 
        if (xtype !== undefined) {
            let required = xtype.required;
            if (required !== undefined) {
                // required.required = true;
                rules[field.name].push(Object.assign({}, {field:field}, required, {required:field.required}));
            }
        }
    }
    if (field.vaildator !== undefined && field.hidden !== true) {
        if (rules[field.name] === undefined){
            rules[field.name] = [];
        }
        rules[field.name] = rules[field.name].concat(Object.assign({}, {field:field}, field.vaildator));
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

function _removeRequiredFalseRule(rules) {
    for (let key in rules) {
        let field = rules[key];
        for(var i = field.length-1; i>=0; i--){
            let rule = field[i];
            if (rule.required === false){
                field.splice(i, 1);
            }
        }
        if (field.length === 0) {
            delete rules[key];
        }
    }
}

</script>
<style>
.tg-form-wrap{}
</style>
