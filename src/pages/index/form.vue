<template>
    <div>
        <iview-fc-form :fields="fields" type="iview" :column=4></iview-fc-form>
    </div>
</template>

<script>
import Student from "../../models/Student";
import TgForm from '../../../components/tg-form'
import IviewFcForm from '../../../formConnector/iview/iview-fc-form'
import IviewFcStatic from '../../../formConnector/iview/iview-fc-static'
console.log(IviewFcForm)
let inst = new Student();
export default {
    data(){
        return {
            fields: inst.view("默认表单:form"),
            param:{
                append:"11"
            }
        }
    },
    components: {
        TgForm,IviewFcForm,IviewFcStatic
    },
}
</script>

<style>

</style>
