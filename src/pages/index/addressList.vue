<template>
  <div class="tg-row">
      <div class="tg-col-4">
          <Tree :data="data1"></Tree>
      </div>
      <div class="tg-col-8">
            <Table :columns="columnDefs" :data="rowData" @on-sort-change="sortChanged"></Table>
      </div>
  </div>
</template>

<script>
import Dept from "../../models/Dept";
import User from "../../models/User";
import iviewAdapter from "../../ComAdapter/iviewAdapter";
import utils from '../../utils.js';
let inst = new Dept();
let inst_scd = new User();
export default {
    data() {
        return {
            data1:[],
            gridOptions: {},
            columnDefs: inst_scd.meta("默认表格", "table"),
            rowData: null,
            gridApi: null,
            columnApi: null,
            autoGroupColumnDef: null
        }
    },
    beforeMount() {
        this.rowData = [];
    },
    created() {
        inst.findAll().then(datas => {
            this.data1 = inst.toTreeData(datas.data);
        })
        this.queryUser();
    },
    methods: {
        queryUser(){
            inst_scd.staticOrder([{"created_at":"+"}])
            inst_scd.pageSize = 500;
            inst_scd.findAll().then(datas => {
                this.rowData = datas.data;
            })
        },
        onGridReady(params) {
            this.gridApi = params.api;
            this.columnApi = params.columnApi;
        },
        getSelectedRows() {
            const selectedNodes = this.gridApi.getSelectedNodes();
            const selectedData = selectedNodes.map(node => node.data);
            const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
            alert(`Selected nodes: ${selectedDataStringPresentation}`);
        },
        sortChanged(param) {
            let field = {};
            field[param.key] = param.order === "desc" ? "-" : "+";
            inst_scd.order([field]);
            debugger
            this.queryUser();
        }
    },
}
</script>

<style>

</style>
