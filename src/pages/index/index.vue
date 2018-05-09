<template>
    <div class="page_border">
        <!-- 静态图片的写法请参照以下方式 -->
        <h1 class="index">
            首页
        </h1>
        <tg-div>
            <tg-div class="tg-left">1</tg-div>
            <tg-div class="tg-left">2</tg-div>
            <tg-div class="tg-left">3</tg-div>
        </tg-div>
        <h2>列表样式</h2>
        <tg-listview :datasource="ds" bordered autoReadyDataBind pagination>
            <template slot="itemTemplate" slot-scope="props">
                <tg-div class="tg-col-6">
                    <tg-text class="tg-primary-1">数据内容{{props.data}}</tg-text>
                    <tg-text class="tg-grey-3">行标识{{props.index}}</tg-text>
                </tg-div>
                <tg-div class="tg-col-3">
                    <tg-text><Badge count="new" class-name="tg-primary-1 tg-bg-white tg-br-primary-1"></Badge></tg-text>
                </tg-div>
                <tg-div class="tg-col-3">
                    <tg-text><tg-linkbutton>Text</tg-linkbutton></tg-text>
                </tg-div>
            </template>
        </tg-listview>
        <p />
        <h2>卡片样式</h2>
        <tg-listview :datasource="ds" :grid="{gutter: 16, column: 3}" @ready="init" pagination>
            <template slot="itemTemplate" slot-scope="props">
                <Card style="width:100%">
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        <tg-text class="tg-primary-1">主标题{{props.data}}</tg-text>
                    </p>
                    <tg-text class="tg-grey-3">副标题{{props.index}}</tg-text>
                    <tg-text><Badge count="new" class-name="tg-primary-1 tg-bg-white tg-br-primary-1"></Badge></tg-text>
                    <tg-text><tg-linkbutton>Text</tg-linkbutton></tg-text>
                </Card>
            </template>
        </tg-listview>
        <p />
        <h2>图标样式</h2>
        <tg-listview ref="tglist" :datasource="ds" :grid="{gutter: 40}" @ready="init" pagination>
            <template slot="itemTemplate" slot-scope="props">
                <tg-div>
                    <Icon type="stop" size="107"></Icon>
                </tg-div>
                <tg-div class="tg-text-center">
                    <tg-text class="tg-primary-1">主标题{{props.data}}</tg-text>
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
                grid: {
                    gutter: 16, column: 3
                },
                ds:{
                    inst:{
                        findAll:function(params) {
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
        },
        methods:{
            init(inst){
                inst.DataBind();
            }
        }
    }
</script>
