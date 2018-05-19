<template>
    <div class="tg-p-16">
        <Table :columns="columns1" :data="result"></Table>
<hr class="tg-m-32">
        <emap-form :fields="fields" v-model="formItem" :column="2"></emap-form>

        <Button @click="getData">GetData</Button>
    </div>
</template>

<script>
import EmapForm from '../../bizComs/emap-form'
import Student from './studentModel'
let student = new Student();
export default {
    data(){
        return {
            columns1: student.view("grid", "table"),
            fields: student.view("form", "form"),
            result:[],
            formItem:{},
            pager:{}
        }
    },
    components: {
        EmapForm
    },
    created(){
        student.findAll().then(datas => {
            this.result = datas.rows;
        })
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
