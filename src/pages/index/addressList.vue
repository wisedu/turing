<template>
  <div class="tg-row">
      <div class="tg-col-2 tg-p-16">
            <div class="tg-row">
                <div class="tg-left">
                    <Input v-model="deptSearchKey" placeholder="搜索" style="width: 150px">
                        <span slot="prepend"><Icon type="search"></Icon></span>
                    </Input>
                </div>
                <div class="tg-right">
                    <Button type="primary" icon="plus" @click="deptModal = true"></Button>
                </div>
            </div>
            <Tree :data="data1" @on-select-change="onTreeSelected"></Tree>
      </div>
      <div class="tg-col-10 tg-p-16">
          <div class="tg-mb-16">
            <Button>添加人员</Button> <Button @click="setUserToDept">设置部门</Button>
          </div>
          <Table :columns="columnDefs" :data="rowData" @on-sort-change="sortChanged" @on-select-all="onTableSelect" @on-select="onTableSelect" @on-filter-change="onFilter"></Table>
      </div>
      <Modal v-model="deptModal" title="部门" @on-ok="saveDept" @on-cancel="cancel">
            <emap-form :fields="fields" v-model="deptData" :column="1"></emap-form>
      </Modal>
  </div>
</template>

<script>
import Dept from "../../models/Dept";
import User from "../../models/User";
import EmapForm from '../../bizComs/emap-form'
let inst = new Dept();
let inst_scd = new User();
export default {
  data() {
    return {
      data1: [],
      gridOptions: {},
      columnDefs: inst_scd.view("默认列表:table"),
      rowData: null,
      deptSearchKey: "",
      deptModal: false,
      fields: inst.view("默认表单:form"),
      deptData: {},
      userDeptModal: false,
      selectedNode:{},
      selectedRows:[]
    };
  },
  components: {
        EmapForm
  },
  beforeMount() {
    this.rowData = [];
  },
  created() {
    inst.findAll().then(datas => {
      this.data1 = inst.toTreeData(datas.data);
    });
    this.queryUser();
    inst_scd.getAllCreatedTime().then(data => {
      this.columnDefs.filter(item => {
        if (item.key === "created_at") {
          item.filters = data.map(records => {
            return {
              label: records.created_at,
              value: records.created_at
            };
          });
        }
      });
    });
  },
  methods: {
    queryUser() {
      inst_scd.actions.findAll.orders = [{ created_at: "+" }];
      inst_scd.pageSize = 100;
      inst_scd.findAll().then(datas => {
        this.rowData = datas.data;
      });
    },
    sortChanged(param) {
      let field = {};
      field[param.key] = param.order === "desc" ? "-" : "+";
      let order = inst_scd.order(field);
      this.queryUser();
    },
    saveDept() {
      inst.save(this.deptData).then(result => {
        alert("ok")
      })
    }, 
    cancel() {

    },
    setUserToDept() {
      if (confirm("将已选中的用户设置到 " + this.selectedNode.name + " 部门下吗？")){
        inst_scd.setUserToDept(this.selectedNode, this.selectedRows);
      }
    },
    onTreeSelected(node) {
      this.selectedNode = node[0];
    },
    onTableSelect(selection) {
      this.selectedRows = selection;
    },
    onFilter(data) {
      let key = data.key;
      let values = data.selectedFilterValue;
      if (values.length === 0) {
        delete inst_scd.actions.findAll.params[key];
      } else {
        inst_scd.actions.findAll.params[key] = values;
      }
      this.queryUser();
    }
  }
};
</script>

<style>
</style>
