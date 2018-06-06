<template>
    <div>
        <Form :model="formValue" :label-width="labelWidth">
            <tg-listview :datas="tglistFields" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props" v-if="props.data.hidden !== true">
                    <slot :name="props.data.name" :model="props.data" :value="formValue[props.data.name]" :ref="'field_' + props.data.name">
                        <component :model="props.data" :name="props.data.name" :is="registedComponentList(props.data, iviewForm, 'iview-fc-static', props.index)"
                        v-model="formValue[props.data.name]" :ref="'field_' + props.data.name" 
                        :caption="props.data.caption" :xtype="props.data.xtype" :placeholder="props.data.placeholder"
                        :required="props.data.required" :readonly="props.data.readonly" :disabled="props.data.disabled"
                        :params="props.data.params" :options="props.data.options" @on-item-change="updateValue"></component>
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
}
</script>

<style>

</style>
