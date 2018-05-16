<template>
  <div class="tg-row">
      <div class="tg-col-3">
            <Tree :data="data1"></Tree>
      </div>
      <div class="tg-col-9">
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
            autoGroupColumnDef: null,

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
        inst_scd.getAllCreatedTime().then(data => {
            this.columnDefs.filter(item => {
                if (item.key === "created_at") {
                    item.filters = data.map(records => {
                        return {
                            label: records.created_at,
                            value: records.created_at
                        }
                    });
                    item.filterRemote = function(value, key, meta, params) {
                        let filter = {};
                        filter[key] = value;
                        this.queryUser(filter);
                    }
                } else if (item.key === "photo") {
                    item.filterRemote = function(value, key, meta, params) {
                        let filter = {};
                        filter[key] = value;
                        this.queryUser(filter);
                    }
                }
            })
        })
    },
    methods: {
        queryUser() {
            inst_scd.staticOrder([{"created_at":"+"}])
            inst_scd.pageSize = 10;
            inst_scd.findAll().then(datas => {
                this.rowData = datas.data;
            })
        },
        sortChanged(param) {
            let field = {};
            field[param.key] = param.order === "desc" ? "-" : "+";
            let order = inst_scd.order(field);
            this.queryUser();
        }
    },
}
</script>

<style>

</style>
