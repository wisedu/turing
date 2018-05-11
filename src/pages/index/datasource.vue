<template>
  <div>
        <Table :columns="columns1" :data="result.rows"></Table>
        <Page :total="result.totalSize" :current="result.pageNumber" :page-size="result.pageSize" show-elevator show-sizer></Page>

        <Form :model="formItem" :label-width="100">
            <tg-listview :datas="fields" :grid="{gutter:0, column:4}">
                <template slot="itemTemplate" slot-scope="props">
                    <FormItem :label="props.data.caption">
                        <template v-if="props.data.xtype === undefined || props.data.xtype === '' || props.data.xtype === 'text'">
                            <Input v-model="formItem[props.data.name]" :placeholder="props.data.placeholder"></Input>
                        </template>
                        <template v-else-if="props.data.xtype === 'select'">
                            <Select v-model="formItem[props.data.name]" >
                                <Option v-for="item in props.data.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </template>
                    </FormItem>
                </template>
            </tg-listview>
        </Form>

        <Button @click="getData">GetData</Button>
  </div>
</template>

<script>
import TgListview from '../../components/tg-listview.vue'
import strcExample from "../../../mock/model";
import dataExample from "../../../mock/data";
import iviewAdapter from "../../ComAdapter/iviewAdapter";
import { DataAdapter } from "../../DataBind/DataAdapter";
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
        TgListview
    },
    created(){
        let da = new DataAdapter();
        da.setMeta(strcExample);
        this.columns1 = iviewAdapter("table", da.getMeta("grid"), {minWidth:150})
        this.fields = iviewAdapter("form", da.getMeta("form"))
    },
    methods:{
        getData(){
            
            console.log(this.formItem);
            debugger
        }
    }
}
</script>

<style>

</style>
