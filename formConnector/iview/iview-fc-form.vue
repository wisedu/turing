<template>
    <div :class={readonly:readonly}>
        <Form :model="formValue" :label-width="labelWidth" :rules="ruleValidate">
            <tg-listview :datas="tglistFields" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props" v-if="props.data.hidden !== true">
                    <slot :name="props.data.name" :model="props.data" :value="formValue[props.data.name]" :ref="'field_' + props.data.name" :formReadonly="readonly">
                        <component :model="props.data" :name="props.data.name" :is="registedComponentList(props.data, iviewForm, 'iview-fc-static', props.index)"
                        v-model="formValue[props.data.name]" :ref="'field_' + props.data.name" :formReadonly="readonly"
                        :caption="props.data.caption" :xtype="props.data.xtype" :placeholder="props.data.placeholder"
                        :required="props.data.required" :readonly="props.data.readonly" :disabled="props.data.disabled"
                        :params="props.data.params" :options="props.data.options" @on-item-change="updateValue"></component>
                    </slot>
                </template>
                <template slot="afterTemplate">
                    <slot name="after"></slot>
                </template>
            </tg-listview>
        </Form>
    </div>
</template>

<script>
import iviewForm from "./form";
import formConnector from "../FormConnector";
import TgListview from "../../components/tg-listview";
import IviewFcStatic from "./iview-fc-static";
export default {
    name:"iview-fc-form",
    extends: formConnector,
    components: {
        TgListview,IviewFcStatic
    },
    data(){
        return {
            //当前字段隐藏时，让listview组件所占位的格子也隐藏
            tglistFields:[],
            iviewForm: iviewForm,
            ruleValidate: {}
        }
    },
    created(){
        let rules = {};
        this.tglistFields = this.fields.map(item => {
            if (item.hidden === true) {
                item._lv_hidden = true;
            } else {
                rules[item.name] = []
                if (item.required === true) {
                    rules[item.name].push({
                        required: true, trigger: 'blur', message: `${item.name} 不能为空`
                    });
                }
            }
            return item;
        });

        for(let key in rules) {
            if (rules[key].length === 0){
                delete rules[key];
            }
        }
        this.ruleValidate = rules;
    }
}
</script>

<style>
.readonly .ivu-form{
    border-top: 1px solid #e9eaec;
    border-left: 1px solid #e9eaec;
}
.readonly .ivu-form .ivu-form-item-label{
    background-color: #f8f8f9;
    border-bottom: 1px solid #e9eaec;
    border-right: 1px solid #e9eaec;
}
.readonly .ivu-form .ivu-form-item{
    margin-bottom: 0;
    display: flex;
}
.readonly .ivu-form .ivu-form-item-content{
    border-bottom: 1px solid #e9eaec;
    border-right: 1px solid #e9eaec;
    width: calc(100% - 100px);
    margin-left: 0!important;
}
.readonly .ivu-form .ivu-upload-select{
    display: none;
}
</style>
