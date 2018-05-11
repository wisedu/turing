<template>
    <div>
        <Form :model="formValue" :label-width="100">
            <tg-listview :datas="model" :grid="{gutter:0, column:4}">
                <template slot="itemTemplate" slot-scope="props">
                    <FormItem :label="props.data.caption">
                        <template v-if="props.data.xtype === undefined || props.data.xtype === '' || props.data.xtype === 'text'">
                            <Input v-model="formValue[props.data.name]" :placeholder="props.data.placeholder"></Input>
                        </template>
                        <template v-else-if="props.data.xtype === 'select'">
                            <Select v-model="formValue[props.data.name]" @click.native.once="ClickSelectHandler(props.data)">
                                <Option v-for="item in props.data.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </template>
                    </FormItem>
                </template>
            </tg-listview>
        </Form>
    </div>
</template>

<script>
import TgListview from '../components/tg-listview'
export default {
    name:"emap-form",
    components: {
        TgListview
    },
    props:{
        fields:Array,
        value:Object
    },
    data(){
        return {
            formValue:{},
            model:{}
        }
    },
    watch:{
        formValue:{
            handler(){
                this.$emit("input", this.formValue)
            },
            deep:true
        }
    },
    created(){
        this.model = this.fields;
    },
    methods:{
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
