<template>
    <div class="tg-person-wrap">
        <div class="us-modal">
            <div class="tjyh-main">
                <component :is="type + '-pe-left'" :treeData="treeData" :tabData="tabData" @on-treeItemSelect="treeItemSelect_p"></component>
                <component :is="type + '-pe-center'" :users="users" @on-check="check_p"></component>
                <component :is="type + '-pe-right'" :selected="selected" @on-delete="delete_p"></component>
            </div>
        </div>
    </div>
</template>

<script>
import defaults from "../Defaults";
export default {
    name: "tg-person",
    extends: '',
    props: {
        users: Array,
        treeData: [Array, Object],
        selected: Array,
        treeData: Array,
    },
    data() {
        return {
            
        }
    },
    watch:{
        treeData: {
            handler:function(newValue){
                //
            },
            deep: true
        }
    },
    computed:{

    },
    created() {
        this.searchUser();
    },
    methods: {
        treeItemSelect_p(data){
            this.$emit("treeItemSelect_p_p", data);
        },
        check_p(data){
            this.$emit("check_p_p", data);
        },
        delete_p(data){
            this.$emit("delete_p_p", data);
        },
    }
}
</script>

<style>

</style>
