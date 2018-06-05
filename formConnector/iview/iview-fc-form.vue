<template>
    <div>
        <Form :model="formValue" :label-width="labelWidth">
            <tg-listview :datas="tglistFields" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props" v-if="props.data.hidden !== true">
                    <slot :name="props.data.name" :model="props.data" :value="formValue[props.data.name]" @sync-change="handleSyncChange" :ref="'field_' + props.data.name">
                        <component :model="props.data" :is="registedComponentList(props.data, iviewForm)" @sync-change="handleSyncChange" 
                        v-model="formValue[props.data.name]" :ref="'field_' + props.data.name"
                        :caption="props.data.caption" :xtype="props.data.xtype" :placeholder="props.data.placeholder"
                        :required="props.data.required" :readonly="props.data.readonly" :disabled="props.data.disabled"
                        :params="props.data.params" :options="props.data.options"></component>
                    </slot>
                </template>
                <template slot="afterTemplate">
                    <slot name="after"></slot>
                </template>
            </tg-listview>
        </Form>
    </div>
</template>

<script>
//:display-value.sync="value[props.data.display]" 
import iviewForm from "./form";
import formConnector from "../FormConnector";
export default {
    name:"iview-fc-form",
    extends: formConnector,
    data(){
        return {
            //当前字段隐藏时，让listview组件所占位的格子也隐藏
            tglistFields:this.fields.map(item => {
                if (item.hidden === true) {
                    item._lv_hidden = true;
                }
                return item;
            }),
            iviewForm: iviewForm
        }
    },
    methods:{
        registedComponentList(model, connectorItems){
            let xtype = model.xtype;
            let caption = model.caption;
            if (xtype === undefined) {
                console.warn(`Turing FormConnector: field ${caption}'s xtype is undefined, instead of using 'static'.`, model)
                return connectorItems['static']
            } else if (connectorItems[xtype] === undefined) {
                console.warn(`Turing FormConnector: field ${caption}'s xtype '${xtype}' is undefined, instead of using 'iview-fc-static'.`, model)
                return 'iview-fc-static';
            } else {
                return connectorItems[xtype]
            }
        }
    }
}
</script>

<style>

</style>
