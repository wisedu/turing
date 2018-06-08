<template>
    <div>
        <tg-form :fields="fields" type="iview" :column=4></tg-form>
        <hr>
        <tg-form :fields="fields_scd" type="iview" :column=4></tg-form>
    </div>
</template>

<script>
import Student from "../../models/Student";
import TgForm from '../../../components/tg-form'
let inst = new Student();
export default {
    data(){
        return {
            fields: inst.view("默认表单:form"),
            fields_scd: inst.view("search"),
            param:{
                append:"11"
            }
        }
    },
    components: {
        TgForm,
    },
}
</script>

<style>

</style>
