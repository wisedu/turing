<template>
    <div class="page_border">
        <!-- 静态图片的写法请参照以下方式 -->
        <img class="right_icon" src="../../assets/title.jpg">
        <h1 class="index">
            首页
        </h1>
        <tg-listview :datasource="ds">
            <template slot="itemTemplate" slot-scope="props">
                <tg-div class="tg-col-6 tg-col-560-6 ">
                    <tg-text class="tg-primary-1">主标题{{props.index}}</tg-text>
                    <tg-text class="tg-grey-3">副标题{{props.index}}</tg-text>
                </tg-div>
                <tg-div class="tg-col-3 tg-col-560-6">
                    <tg-text><Badge count="new" class-name="tg-primary-1 tg-bg-white tg-br-primary-1"></Badge></tg-text>
                </tg-div>
                <tg-div class="tg-col-3 tg-col-560-hide">
                    <tg-text><tg-linkbutton>Text</tg-linkbutton></tg-text>
                </tg-div>
            </template>
        </tg-listview>
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
    import TgListview from '../../components/tg-listview.vue'
    import TgDiv from '../../components/tg-div.vue'
    import TgText from '../../components/tg-text.vue'
    import TgLinkbutton from '../../components/tg-linkbutton.vue'
    export default {
        data(){
            return {
                page: 'about',
                ds:{
                    inst:{
                        findAll:function() {
                            return new Promise((resolve, reject) => {
                                resolve({rows:[{},{},{}]});
                            });
                        }
                    }
                }
            }
        },
        components: {
            TgListview,TgDiv,TgText,TgLinkbutton
        },
        mounted(){
        }
    }
</script>
