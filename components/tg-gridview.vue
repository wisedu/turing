<template>
    <div class="tg-gridview-wrap">
        <component :model="formValue" :fields="fields" :is="type + '-gb-search'" :value="value" :displayFieldFormat="displayFieldFormat"
            :column="fieldColumn" :labelWidth="labelWidth" @on-value-change="updateValue" @search="searchReload" @clear="searchClear">
            <slot :name="'search-'+model.name" :slot="'search-'+model.name" v-for="model in fields"></slot>
        </component>
        <tg-toolbar v-if="showToolbar">
            <slot name="toolbar-left" slot="left"></slot>
            <slot name="toolbar-right" slot="right"></slot>
        </tg-toolbar>
        <component :is="type + '-gb-grid'" :columns="columns" :data="data" :pager="pager" :loading="loading"
            @reload="tableReload" @on-highlight="onHighlight" @on-select-all="onSelectAll" @on-selection-change="onSelectionChange">
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
        displayFieldFormat: String,
        labelWidth: Number,
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
        loading: Boolean,
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
            formDisplay: {},
            showToolbar: true
        }
    },
    created() {
        if (this.$slots["toolbar-left"] === undefined && this.$slots["toolbar-right"] === undefined) {
            this.showToolbar = false;
        }
    },
    methods: {
        tableReload(pageNumber, pageSize) {
            this.$emit("reload", pageNumber, pageSize, this.formValue, "columns")
        },
        searchReload() {
            this.$emit("reload", 1, this.pager.size, this.formValue, "fields")
        },
        searchClear() {
            this.formValue = {};
            this.$emit("update:fields-data", {})
        },
        updateValue(name, value, display, model){
            if (value === "") {
                this.$delete(this.formValue, name);
                this.$delete(this.formDisplay, name);
            } else {
                this.$set(this.formValue, name, value);
                if (display !== undefined) {
                    this.formDisplay[name] = display;
                }
            }
            this.$emit("on-value-change", name, value, display, model, this.formValue);
            this.$emit("update:fields-data", this.formValue)
        },
        onHighlight(currentRow, oldCurrentRow) {
            this.$emit("on-highlight", currentRow, oldCurrentRow);
        },
        onSelectAll(selection) {
            this.$emit("on-select-all", selection);
        },
        onSelectionChange(selection) {
            this.$emit("on-selection-change", selection);
        },
    }
}
</script>

<style>
.tg-gridview-wrap{}
</style>
