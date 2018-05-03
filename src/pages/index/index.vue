<template>
    <div class="page_border">
        <!-- 静态图片的写法请参照以下方式 -->
        <img class="right_icon" src="../../assets/title.jpg">
        <h1 class="index">
            首页
        </h1>
        <emap-flow-toolbar defkey="aaa" taskid="aaa"></emap-flow-toolbar>
    </div>
</template>
<style>
.index{
    background:#ffffff;
}
.right_icon{
    float: right;
    height: 50px;
    padding-right: 8px;
}
.page_border{
    padding: 4px;
}
</style>
<script type="text/javascript">
    import EmapFlowToolbar from '../../components/emap-flow-toolbar.vue'
    export default {
        data(){
            return {
                page: 'about'
            }
        },
        components: {
            EmapFlowToolbar
        },
        mounted(){
        }
    }
</script>
