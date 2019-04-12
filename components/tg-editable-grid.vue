<template>
    <div>
        <div slot="toolbar" class="toolbar" v-if="showToolbar && readonly !== true">
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
        rowRending: Function,
        readonly: Boolean,
        hideCol: String,
        readonlyCol: String,
        columnAutosizing: {
            type: Boolean,
            default:false
        }
    },
    data() {
        return {
            inst:null,
            activedIndex:-1,
            uuid: uuid(),
            columnsCopy: this.columns, //columns的镜像值
        }
    },
    computed:{
        autoHeight(){
            let actual = (this.value instanceof Array ? this.value.length + 1 : 1) * 50;
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
            this.columnsCopy = newVal;
            if (this.inst !== null) {
                this.inst.grid.terminate();
            }
            this.initGrid();
        },
        value:{
            handler:function(newVal, oldVal){
                this.setData(newVal);
            },
            deep:true,
        }
    },
    mounted(){
        this.initGrid();
        if (this.value instanceof Array && this.value.length > 0) {
            this.setData(this.value);
        }
    },
    methods:{
        addRow(row){
            let newRows = [];
            if (this.value instanceof Array) {
                newRows = this.value.concat(row);
            } else {
                newRows.push(row);
            }
            this.$emit("on-item-change", this.name, newRows, undefined, this.columnsCopy, {row: row, index: newRows.length, name: this.name})
            this.$emit("input", newRows)
        },
        removeActivedRow(){
            if (this.value instanceof Array && this.value.length > 0) {
                let removeRow = this.value.splice(this.activedIndex, 1)
                this.$emit("on-item-change", this.name, this.value, undefined, this.columnsCopy, {row: removeRow[0], index:undefined, name: this.name})
                this.$emit("input", this.value)
            }
        },
        initGrid(){
            // 运行态去除需要隐藏的列
            if(this.hideCol&&this.columns.length>0){
                var hideCols = this.hideCol.split(',');
                var colsName = [];
                this.columnsCopy.forEach(function(col){
                    colsName.push(col.name);
                });
                var index;
                for(var i=hideCols.length-1;i>=0;i--){
                    index = colsName.indexOf(hideCols[i]);
                    if(index>-1) this.columnsCopy.splice(index,1);
                }
            }
            console.log('除去隐藏项后的columns:', this.columnsCopy);
            // 运行态处理只读项,将xtype改成readonly
            if(this.readonlyCol&&this.columnsCopy.length>0){
                var readonlyCols = this.readonlyCol.split(',');
                var that = this;
                readonlyCols.forEach(function(col){
                    that.columnsCopy.map(function(obj){
                        if(obj.name === col){
                            obj.xtype = 'readonly';
                        }
                        return obj;
                    });
                });
            }
            console.log('处理只读项后的columns:', this.columnsCopy);
            
            if (this.columnsCopy.length > 0) {
                let EditableGrid = window["tg-editable-grid"].default;
                if (this.readonly === true) {
                    this.params.readOnly = true;
                }
                this.inst = new EditableGrid(this.$refs.editableGrid, Object.assign({}, this.params, {displayFieldFormat:this.displayFieldFormat, columnAutosizing: this.columnAutosizing}));
                this.inst.grid.properties.columnAutosizing = this.columnAutosizing;
                let that = this;
                this.inst.onEditorLoadData = function(model, value, callback) {
                    switch (model.xtype) {
                        case "tree":
                            if (model.dict !== undefined) {
                                defaults.getDictTreeData[0](model.dict, {key:value}, datas => {
                                    // 当datas非树形数据时，将datas直接返回，每项分别作为树的根目录 修改人：王永建  2019/1/8
                                    let correntDatas = datas;
                                    correntDatas = correntDatas.map(function(data){
                                        data.text = data.label||data.name;
                                        return data
                                    });
                                    let treedatas = that.inst.utils.toTreeData(correntDatas, "", {ukey:"id", pkey:'pId', toCKey:'children'});
                                    if(treedatas.length){
                                        callback(treedatas);
                                    }else{
                                        callback(correntDatas);
                                    }
                                    
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
                this.inst.setSchema(this.columnsCopy);

                if (this.readonly !== true) {
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
                }

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
                this.inst.setData(this.value);
            }
        },
        setData(datas){
            this.inst.setData(datas);
            // this.$emit("on-item-change", this.name, datas, undefined, this.columnsCopy, {})
            this.$emit("input", datas)
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
