<template>
    <div>
        <div slot="toolbar" class="toolbar" v-if="showToolbar">
            <a :href="'#' + uuid" @click="addRow({})">添加行</a> | 
            <a href="javascript:void(0)" @click="removeActivedRow()">删除选中行</a>
        </div>
        <div ref="editableGrid" class="tg-editable-grid" :style="{height:autoHeight + 'px'}" v-bind="params"></div>
        <span :id="uuid"></span>
    </div>
</template>

<script>
import defaults from "../Defaults";
import uuid from 'uuid';
export default {
    name: "tg-editable-grid",
    props: {
        name: String,
        showToolbar:false,
        height: {
            type:Number,
            default: -1
        },
        maxHeight: {
            type:Number,
            default: 550
        },
        params: {
            type:Object, 
            default(){
                return {}
            }
        },
        columns: Array,
        value: {
            type:Array,
            default:function() {
                return [];
            }
        },
        loading: Boolean,
        displayFieldFormat: {
            type:String,
            default:""
        },
        params: {
            type: Object,
            default:function() {
                return {};
            }
        },
        rowRending: Function
    },
    data() {
        return {
            inst:null,
            activedIndex:-1,
            uuid: uuid()
        }
    },
    computed:{
        autoHeight(){
            let actual = (this.value.length + 1) * 50;
            if (this.height !== -1) {
                actual = this.height;
            }
            if (this.maxHeight < actual) {
                return this.maxHeight;
            } else {
                return actual;
            }
        }
    },
    watch:{
        columns(newVal, oldVal){
            if (this.inst !== null) {
                this.inst.grid.terminate();
            }
            this.initGrid();
        },
        value(newVal, oldVal){
            this.setData(newVal);
        }
    },
    mounted(){
        this.initGrid();
        if (this.value !== undefined && this.value.length > 0) {
            this.setData(this.value);
        }
    },
    methods:{
        addRow(row){
            this.value.push(row)
        },
        removeActivedRow(){
            this.value.splice(this.activedIndex, 1)
        },
        initGrid(){
            if (this.columns.length > 0) {
                let EditableGrid = window["tg-editable-grid"].default;
                this.inst = new EditableGrid(this.$refs.editableGrid, Object.assign({}, this.params, {displayFieldFormat:this.displayFieldFormat}));
                this.inst.onEditorLoadData = function(model, value, callback) {
                    switch (model.xtype) {
                        case "tree":
                            if (model.dict !== undefined) {
                                defaults.getDictTreeData[0](model.dict, {key:value}, datas => {
                                    let treedatas = inst.utils.toTreeData(datas, "", {ukey:"id", pkey:'pId', toCKey:'children'})
                                    callback(treedatas);
                                });
                            } else if (model.options !== undefined) {
                                callback(model.options);
                            }
                            break;
                        default:
                            if (model.dict !== undefined) {
                                defaults.getDictData[0](model.dict, {key:value}, datas => {
                                    callback(datas);
                                });
                            } else if (model.options !== undefined) {
                                callback(model.options);
                            }
                            break;
                    }
                }
                this.inst.setSchema(this.columns);
                this.inst.grid.addEventListener('fin-editor-data-change', event => {
                    // console.log(event)
                    let name = event.detail.input.column.schema.name;
                    let newValue = event.detail.newValue;
                    let oldValue = event.detail.oldValue;
                    let schema = event.detail.input.column.schema;
                    let row = event.detail.input.event.dataRow;
                    row[name] = newValue;
                    //刷新最新值
                    let index = event.detail.input.event.dataCell.y;
                    this.$emit("on-item-change", name, newValue, oldValue, schema, {row, index, name:this.name});
                    this.$emit("input", this.inst.getData());
                });

                 this.inst.grid.addEventListener('tg-checkbox-change', event => {
                    // console.log(event)
                    let name = event.detail.name;
                    let newValue = event.detail.value;
                    let schema = event.detail.schema;
                    let row = event.detail.dataRow;
                    //刷新最新值
                    let index = event.detail.dataCell.y;
                    this.$emit("on-item-change", name, newValue, undefined, schema, {row, index, name:this.name});
                    this.$emit("input", this.inst.getData());
                });

                this.inst.grid.addEventListener('fin-click', event => {
                    let row = event.detail.row;
                    let rowIndex = event.detail.dataCell.y;
                    this.activedIndex = rowIndex;
                    this.$emit("on-highlight", row, rowIndex);
                });
                this.inst.grid.addEventListener('fin-row-header-clicked', event => {
                    let row = event.detail.row;
                    let rowIndex = event.detail.dataCell.y;
                    this.activedIndex = rowIndex;
                    this.$emit("on-highlight", row, rowIndex);
                });
                // this.inst.grid.addEventListener('fin-row-selection-changed', event => {
                //     let row = event.detail.input.event.dataRow;
                //     this.$emit("on-selection-change", row);
                // });
                this.inst.grid.addEventListener('fin-grid-rendered', event => {
                    this.$emit("ready");
                });
                // this.inst.setData([]);
            }
        },
        setData(datas){
            this.inst.setData(datas);
        },
        setErrorCells(datas){
            // let datas = [{row:1,name:"",message:"",type:""}];
            let cells = {};
            datas.map(item => {
                if (cells[item.row] === undefined){
                    cells[item.row] = {}
                }
                let color = "#ed4014";
                switch(item.type) {
                    case "primary":
                        color = "#2d8cf0";
                        break;
                    case "warning":
                        color = "#ff9900";
                        break;
                    case "success":
                        color = "#19be6b";
                        break;                    
                }
                cells[item.row][item.name] = { borderLeft: color, borderTop: color, borderBottom: color, borderRight: color, message:item.message };
            })
            this.inst.grid.addProperties({
                custom: {
                    error: cells
                }
            });
        },
        resetWidth(){
            this.inst.resetWidth();
        }
    }
}
</script>

<style scoped>
.tg-editable-grid{
    border:1px solid #E8E8E8;
}
.toolbar{
    margin-bottom:8px;
}
</style>
