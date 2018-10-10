<template>
    <div class="tg-editable-grid">
        <div ref="editableGrid"></div>
    </div>
</template>

<script>
import defaults from "../Defaults";
export default {
    name: "tg-editable-grid",
    props: {
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
        rowRending: Function
    },
    data() {
        return {
            inst:null
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
        addrow(row){
            this.inst.grid.setData(this.inst.grid.getData());
        },
        initGrid(){
            if (this.columns.length > 0) {
                let EditableGrid = window["tg-editable-grid"].default;
                this.inst = new EditableGrid(this.$refs.editableGrid, {displayFieldFormat:this.displayFieldFormat});
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
                    this.$emit("on-item-change", name, newValue, oldValue, schema, row);
                });
                this.inst.grid.addEventListener('fin-row-header-clicked', event => {
                    let row = event.detail.row;
                    let rowIndex = event.detail.dataCell.y;
                    this.$emit("on-highlight", row, rowIndex);
                });
                // this.inst.grid.addEventListener('fin-row-selection-changed', event => {
                //     let row = event.detail.input.event.dataRow;
                //     this.$emit("on-selection-change", row);
                // });
                this.inst.grid.addEventListener('fin-grid-rendered', event => {
                    this.$emit("ready");
                });
            }
        },
        setData(datas){
            this.inst.setData(datas);
        },
        setErrorCells(datas){
            // let datas = [{row:1,name:""}];
            let cells = {};
            datas.map(item => {
                if (cells[item.row] === undefined){
                    cells[item.row] = {}
                }
                cells[item.row][item.name] = { borderLeft: "red", borderTop: "red", borderBottom: "red", borderRight: "red" };
            })
            this.inst.grid.addProperties({
                renderer:['SimpleCell', 'Borders'],
                cells: {
                    data: cells
                }
            });
        }
    }
}
</script>

<style scoped>
.tg-editable-grid{
    border:1px solid #E8E8E8;
}
</style>
