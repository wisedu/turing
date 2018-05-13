<template>
    <div>
        <Form :model="formValue" :label-width="labelWidth">
            <tg-listview :datas="model" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props">
                    <FormItem :label="props.data.caption">
                        <template v-if="props.data.xtype === undefined || props.data.xtype === '' || props.data.xtype === 'text'">
                            <Input v-model="formValue[props.data.name]" :placeholder="props.data.placeholder">
                                <span slot="append" v-if="props.data.append">{{props.data.append}}</span>
                            </Input>
                        </template>
                        <template v-else-if="props.data.xtype === 'select'">
                            <Select v-model="formValue[props.data.name]" @click.native.once="ClickSelectHandler(props.data)">
                                <Option v-for="item in props.data.options" :value="item.value || item" :key="item.value || item">{{ item.label || item }}</Option>
                            </Select>
                        </template>
                        <template v-else-if="props.data.xtype === 'date'">
                            <DatePicker v-model="formValue[props.data.name]" type="date" :placeholder="props.data.placeholder" style="width:100%"></DatePicker>
                        </template>
                        <template v-else-if="props.data.xtype === 'uploadfile'">
                            <Upload action="//jsonplaceholder.typicode.com/posts/">
                                <Button type="ghost" icon="ios-cloud-upload-outline">上传附件</Button>
                            </Upload>
                        </template>
                    </FormItem>
                </template>
                <template slot="afterTemplate">
                    <slot name="after"></slot>
                </template>
            </tg-listview>
        </Form>
    </div>
</template>

<script>
export default {
    name:"emap-form",
    props:{
        fields:Array,
        value:Object,
        column:Number,
        labelWidth:{
            type:Number,
            default:100
        }
    },
    data(){
        return {
            formValue:{},
            model:{}
        }
    },
    watch:{
        value(val){
            this.formValue = val;
        },
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
