<template>
    <div>
        <Form :model="formValue" :label-width="labelWidth">
            <tg-listview :datas="fields" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props">
                    <component :model="props.data" :is="registedComponentList[props.data.xtype || 'static'] || 'iview-md-static'" 
                    v-model="formValue[props.data.name]" @sync-change="handleSyncChange" 
                    :caption="props.data.caption" :xtype="props.data.xtype" :placeholder="props.data.placeholder"
                    :required="props.data.required" :readonly="props.data.readonly" :disabled="props.data.disabled"
                    :options="optionsMap[props.data.name]" :ref="'field' + props.data.name"></component>
                </template>
                <template slot="afterTemplate">
                    <slot name="after"></slot>
                </template>
            </tg-listview>
        </Form>
    </div>
</template>

<script>
//:display-value.sync="value[props.data.display]" 
import iviewForm from "./form";
export default {
    name:"iview-md-form",
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
    computed:{
        registedComponentList(){
            return iviewForm;
        }
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
