<template>
    <div>
        <template v-if="isGroupForm">
            <component :is="type + '-fc-group'" v-for="item in formitems" :key="item.name" :name="item.title" :desc="item.desc">
                <component :model="formValue" :fields="item.items" :is="type + '-fc-form'" :value="value" :displayFieldFormat="displayFieldFormat"
                :column="column" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" :ref="item.name">
                    <slot :name="model.name" :slot="model.name" :model="model" :value="formValue[model.name]" :display="formValue[model.name + displayFieldFormat]" v-for="model in item.items"></slot>
                </component>
            </component>
        </template>
        <template v-else>
            <component :model="formValue" :fields="fields" :is="type + '-fc-form'" :column="column" :displayFieldFormat="displayFieldFormat"
            :value="value" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" ref="tiled_form">
                <slot :name="model.name" :slot="model.name" :model="model" :value="formValue[model.name]" :display="formValue[model.name + displayFieldFormat]" v-for="model in fields"></slot>
            </component>
        </template>
    </div>
</template>
<script>
import formConnector from "../formConnector/FormConnector";

import IviewFcGroup from '../formConnector/iview/iview-fc-group'
import IviewFcForm from '../formConnector/iview/iview-fc-form'
import IviewFcStatic from '../formConnector/iview/iview-fc-static'

import MintFcGroup from '../formConnector/mint/mint-fc-group'
import MintFcForm from '../formConnector/mint/mint-fc-form'
import MintFcStatic from '../formConnector/mint/mint-fc-static'

export default {
    name: "tg-form",
    extends: formConnector,
    props:{
        type:String
    },
    components: {
        IviewFcForm,IviewFcStatic,IviewFcGroup,MintFcGroup,MintFcForm,MintFcStatic
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
}
</script>
<style>

</style>
