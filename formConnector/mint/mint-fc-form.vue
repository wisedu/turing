<template>
    <div class="emapm-form" :class="{'emapm-form-readonly':readonly}">
        <div v-for="metaItem in fields" class="emapm-item" :key="metaItem.name">
            <slot :name="metaItem.name" :model="metaItem" :display-value.sync="formValue[metaItem.displayName]" :value="formValue[metaItem.name]" @sync-change="handleSyncChange" :ref="'field' + metaItem.name">
                <component :model="metaItem" :is="registedComponentList[metaItem.xtype || 'static'] || 'mint-fc-static'" v-model="formValue[metaItem.name]" @sync-change="handleSyncChange" :display-value.sync="formValue[metaItem.displayName]" :options="optionsMap[metaItem.name]" :ref="'field' + metaItem.name"></component>
            </slot>
        </div>
    </div>
</template>

<script>
import mintForm from "./form";
export default {
    name:"mint-fc-form",
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
            return mintForm;
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
