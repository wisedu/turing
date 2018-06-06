<template>
    <div class="emapm-form" :class="{'emapm-form-readonly':readonly}">
        <div v-for="metaItem in fields" class="emapm-item" :key="metaItem.name">
            <slot :name="metaItem.name" :model="metaItem" :display-value.sync="formValue[metaItem.displayName]" :value="formValue[metaItem.name]" @sync-change="handleSyncChange" :ref="'field' + metaItem.name">
                <component :model="metaItem" :is="registedComponentList(props.data, mintForm, 'mint-fc-static')" v-model="formValue[metaItem.name]" @sync-change="handleSyncChange" :display-value.sync="formValue[metaItem.displayName]" :options="optionsMap[metaItem.name]" :ref="'field' + metaItem.name"></component>
            </slot>
        </div>
    </div>
</template>

<script>
import mintForm from "./form";
import formConnector from "../FormConnector";
export default {
    name:"mint-fc-form",
    extends: formConnector,
    data(){
        return {
            mintForm: mintForm
        }
    },
}
</script>

<style>

</style>
