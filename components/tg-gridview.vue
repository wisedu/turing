<template>
    <div class="tg-gridview-wrap">
        <component :model="formValue" :fields="fields" :is="type + '-fc-form'" :value="value" :displayFieldFormat="displayFieldFormat"
            :column="fieldColumn" :labelWidth="labelWidth" :readonly="readonly" @on-value-change="updateValue" :ref="fields">
            <slot name="search-before" slot="before"></slot>
            <slot name="search-after" slot="after">
                <FormItem>
                    <Button @click="searchReload" type="primary">查询</Button>
                    <Button @click="searchClear" type="primary">清空</Button>
                </FormItem>
            </slot>
            <slot :name="'fields-'+model.name" :slot="model.name" v-for="model in fields"></slot>
        </component>
        <tg-toolbar>
            <slot name="toolbar-left" slot="left"></slot>
            <slot name="toolbar-right" slot="right"></slot>
        </tg-toolbar>
        <component :is="type + '-gc-grid'" :columns="columns" :data="data" @reload="tableReload" :pager="pager">
            <slot :name="'columns-'+model.name" :slot="model.name" v-for="model in columns"></slot>
            <slot name="pagerTotal" slot="pagerTotal"></slot>
        </component>
    </div>
</template>

<script>
import defaults from "../Defaults";
export default {
    name: "tg-gridview",
    props: {
        hideToolbar: {
            type: Boolean,
            default: false
        },
        fieldColumn: {
            type: Number,
            default: 4
        },
        fields: Array,
        columns: Array,
        fieldsData: {
            type: Object,
            default:function() {
                return {};
            }
        },
        data: [Array, Object],
        type:{
            type:String,
            default:function(){
                if (defaults.currentType !== undefined) {
                    return defaults.currentType;
                } else {
                    console.error("TgGridView Error: type is undefined, you can set with tg-form or window['tg-turing'].defaults.currentType")
                }
            }
        },
        pager: {
            type: Object,
            default:function() {
                return {size:10,index:1};
            }
        },
    },
    data() {
        return {
            formValue: this.fieldsData,
            formDisplay: {}
        }
    },
    methods: {
        tableReload(pageNumber, pageSize) {
            this.$emit("reload", pageNumber, pageSize, this.formValue, "columns")
        },
        searchReload() {
            this.$emit("reload", 1, this.pager.size, this.formValue, "fields")
        },
        updateValue(name, value, display, model){
            this.$set(this.formValue, name, value);
            if (display !== undefined) {
                this.formDisplay[name] = display;
            }
            this.$emit("on-value-change", name, value, display, model, this.formValue);
            this.$emit("update:fields-data", this.formValue)
        },
        searchClear() {
            this.formValue = {};
            this.formDisplay = {};
        }
    }
}
</script>

<style>
.tg-gridview-wrap{}
</style>
