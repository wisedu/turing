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
    name: "tg-persons",
    extends: '',
    props: {
        users: Array,
        treeData: [Array, Object],
        selected: Array,
        treeData: Array,
        type:{
            type:String,
            default:function(){
                if (defaults.currentType !== undefined) {
                    return defaults.currentType;
                } else {
                    console.error("TgGridView Error: type is undefined, you can set with tg-gridview or window['tg-turing'].defaults.currentType")
                }
            }
        },
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
            this.$emit("on-treeItemSelect", data);
        },
        check_p(data){
            this.$emit("on-check", data);
        },
        delete_p(data){
            this.$emit("on-delete", data);
        },
        searchUser(){
            this.$emit("on-searchUser", data);
        }
    }
}
</script>

<style>

</style>
