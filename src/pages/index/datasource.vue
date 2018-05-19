<template>
  <div>
        <Table :columns="columns1" :data="result.rows"></Table>
        <Page :total="result.totalSize" :current="result.pageNumber" :page-size="result.pageSize" show-elevator show-sizer></Page>

        <emap-form :fields="fields" v-model="formItem"></emap-form>

        <Button @click="getData">GetData</Button>
  </div>
</template>

<script>
import EmapForm from '../../bizComs/emap-form'
import strcExample from "../../../mock/model";
import dataExample from "../../../mock/data";
import iviewAdapter from "../../ComAdapter/iviewAdapter";
import { DataAdapter } from "../../DataBind/DataAdapter";
import utils from '../../utils.js';
export default {
    data(){
        return {
            columns1:[],
            fields:[],
            result:dataExample,
            formItem:{},
            pager:{}
        }
    },
    components: {
        EmapForm
    },
    created(){
        let da = new DataAdapter();
        da.initView(strcExample);
        this.columns1 = iviewAdapter("table", da.getView("grid"), {minWidth:150})
        this.fields = iviewAdapter("form", da.getView("form"))
    },
    methods:{
        getData(){
            console.log(this.formItem);
            debugger
        },
        ClickSelectHandler(meta){
            console.log(meta)
            utils.Post(meta.url).then(results => {
                debugger
                meta.options = results.data;
            })
        }
    }
}
</script>

<style>

</style>
