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
        <component :is="type + '-gb-grid'" :columns="columns" :data="table_data" :pager="pager" :loading="loading" @on-sort-change="sortHandler"
            @reload="tableReload" @on-highlight="onHighlight" @on-select-all="onSelectAll" @on-selection-change="onSelectionChange">
            <slot :name="'columns-'+model.name" :slot="model.name" v-for="model in columns"></slot>
            <slot name="pagerTotal" slot="pagerTotal"></slot>
        </component>
    </div>
</template>

<script>
import ComDataBindBase from '../dataBind/ComDataBindBase'
import defaults from "../Defaults";
export default {
    name: "tg-gridview",
    extends: ComDataBindBase,
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
    },
    data() {
        return {
            formValue: this.fieldsData,
            formDisplay: {},
            showToolbar: true,
            table_data: [],
            filterValues: {},
        }
    },
    watch:{
        data: {
            handler:function(newValue){
                this.table_data = newValue;
            },
            deep: true
        }
    },
    created() {
        if (this.$slots["toolbar-left"] === undefined && this.$slots["toolbar-right"] === undefined) {
            this.showToolbar = false;
        }
        let that = this;
        this.columns.filter(item => item.filters !== undefined).map(col => {
            col.filterRemote = function(values, key) {
                if (values.length === 0) {
                    delete that.filterValues[key];
                } else {
                    that.filterValues[key] = values
                }
                that.reload();
            }
        })
        if (this.autoReadyDataBind === true) {
            this.reload();
        }
    },
    methods: {
        reload(pager, callback) {
            this.dataAdapter.querySetting = this.dataAdapter.querySettingBuilder(Object.assign({}, this.formValue, this.filterValues), "Customer", false);
            this.DataBind(pager, callback);
        },
        SetData(datas) {
            this.$set(this, "table_data", datas);
        },
        tableReload(pageNumber, pageSize) {
            this.$emit("reload", pageNumber, pageSize, this.formValue, "columns");
            this.reload({pageNumber:pageNumber, pageSize:pageSize});
        },
        searchReload() {
            this.$emit("reload", 1, this.pager.size, this.formValue, "fields")
            this.reload({pageNumber:1, pageSize:this.pager.size});
        },
        sortHandler(column, key, order) {
            let keys = key.split(".")
            if (order !== "normal"){
                inst.order(keys.concat([order]));
            } else {
                inst.order(keys);
            }
            this.reload({pageNumber:1, pageSize:this.pager.size})
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
            this.$emit('update:currentRow', currentRow)
            this.$emit("on-highlight", currentRow, oldCurrentRow);
        },
        onSelectAll(selection) {
            this.$emit('update:selection', selection);
            this.$emit("on-select-all", selection);
        },
        onSelectionChange(selection) {
            this.$emit('update:selection', selection);
            this.$emit("on-selection-change", selection);
        },
    }
}
</script>

<style>
.tg-gridview-wrap{}
</style>
