<template>
    <div class="tg-collection-view-wrap">
        <component v-if="searcher !== undefined" :model="formValue" :is="type + '-gb-' + searcher.name" :displayFieldFormat="displayFieldFormat"
            v-bind="searcher" @on-value-change="updateValue" @search="searchReload" @clear="searchClear">
            <slot :name="'search-'+model.name" :slot="'search-'+model.name" v-for="model in searcher.fields"></slot>
        </component>
        <tg-toolbar v-if="showToolbar">
            <slot name="toolbar-left" slot="left"></slot>
            <slot name="toolbar-right" slot="right"></slot>
        </tg-toolbar>
        <component :is="type + '-gb-collection'" :grid="grid" :datas="table_data" :pager="pager" :displayFieldFormat="displayFieldFormat" @reload="tableReload">
            <template slot="itemTemplate" slot-scope="props">
                <slot name="itemTemplate" :data="props.data" :index="props.index"></slot>
            </template>
            <template slot="alternateTemplate" slot-scope="props">
                <slot name="alternateTemplate" :data="props.data" :index="props.index"></slot>
            </template>
        </component>
        <slot name="footer"></slot>
    </div>
</template>

<script>
import ComDataBindBase from '../dataBind/ComDataBindBase'
import defaults from "../Defaults";
export default {
    name: "tg-collection-view",
    extends: ComDataBindBase,
    props: {
        searcher: Object,
        grid:Object,
        datas: [Array, Object],
        type:{
            type:String,
            default:function(){
                if (defaults.currentType !== undefined) {
                    return defaults.currentType;
                } else {
                    console.error("TgcollectionView Error: type is undefined, you can set with tg-collection-view or window['tg-turing'].defaults.currentType")
                }
            }
        },
        displayFieldFormat:{
            type:String,
            default:function(){
                if (defaults.displayFieldFormat !== undefined) {
                    return defaults.displayFieldFormat;
                } else {
                    console.error("TgcollectionView Error: type is undefined, you can set with tg-form or window['tg-turing'].defaults.displayFieldFormat")
                }
            }
        },
        searchHandler: Function,
    },
    data() {
        let searchvalue = {};
        if (this.searcher !== undefined) {
            if (this.searcher.value !== undefined) {
                searchvalue = this.searcher.value;
            }
        }
        return {
            formValue: searchvalue,
            formDisplay: {},
            showToolbar: true,
            filterValues: {},
            sortFields: [],
            loadedData: this.datas
        }
    },
    watch:{
        datas: {
            handler:function(newValue){
                this.loadedData = newValue;
            },
            deep: true
        }
    },
    computed:{
        table_data:function() {
            return this.loadedData;
        }
    },
    created() {
        if (this.$slots["toolbar-left"] === undefined && this.$slots["toolbar-right"] === undefined) {
            this.showToolbar = false;
        }
        
        if (this.autoReadyDataBind === true) {
            this.$emit("on-change", this.pager, this.formValue, this.sortFields, "autoReadyDataBind");
            this.reload();
        }
    },
    methods: {
        reload(pager, callback) {
            if (this.dataAdapter !== undefined && this.dataAdapter.querySettingBuilder !== undefined && this.dataAdapter.actions.findAll.url !== "") {
                this.dataAdapter.querySetting = this.dataAdapter.querySettingBuilder(Object.assign({}, this.formValue, this.filterValues), this.dataAdapter.name, false);
                this.DataBind(pager, callback);
            }
        },
        SetData(datas) {
            this.$emit("update:datas", datas)
            this.loadedData = datas;
        },
        tableReload(pageNumber, pageSize) {
            this.$emit("on-change", {index:pageNumber, size:pageSize}, this.formValue, this.sortFields, "columns");
            if (this.dataAdapter !== undefined) {
                this.reload({pageNumber:pageNumber, pageSize:pageSize});
            }
        },
        searchReload() {
            if (this.searchHandler !== undefined) {
                this.searchHandler(this.formValue);
            } else {
                this.$emit("on-change", {index:1, size:this.pager.size}, this.formValue, this.sortFields, "fields");
                if (this.dataAdapter !== undefined) {
                    this.reload({pageNumber:1, pageSize:this.pager.size});
                }
            }
        },
        searchClear() {
            this.formValue = {};
            this.formDisplay = {};
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
        },
    }
}
</script>

<style>
</style>
