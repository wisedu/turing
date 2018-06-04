<template>
    <div>
        <Form :model="formValue" :label-width="labelWidth">
            <tg-listview :datas="fields" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props">
                    <slot :name="props.data.name" :model="props.data" :value="formValue[props.data.name]" v-if="props.data.hidden" @sync-change="handleSyncChange" :ref="'field_' + props.data.name">
                        <component :model="props.data" :is="registedComponentList[props.data.xtype || 'static'] || 'iview-fc-static'" @sync-change="handleSyncChange" 
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
    computed:{
        registedComponentList(){
            return iviewForm;
        }
    },
}
</script>

<style>

</style>
