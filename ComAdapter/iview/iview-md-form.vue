<template>
    <div>
        <Form :model="formValue" :label-width="labelWidth">
            <tg-listview :datas="model" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props">
                    <component :model="props.data" :is="registedComponentList[props.data.xtype]" v-model="formValue[props.data.name]" 
                    @sync-change="handleSyncChange" :display-value.sync="value[props.data.display]" 
                    :options="optionsMap[props.data.name]" :ref="'field' + props.data.name" :pid="pid"></component>
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
    name:"iview-md-form",
    props:{
        value: { type: Object, default () { return {}; } },
    },
    computed:{
        registedComponentList(){
            return window["tg-turing"].iviewForm
        }
    },
    data(){
        return {
            formValue:this.value,
            optionsMap: {}
        }
    },
    methods:{
        handleSyncChange(val, name) {
            this.$set(this.formValue, name, val);
        },
    }
}
</script>

<style>

</style>
