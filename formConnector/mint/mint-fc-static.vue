<template>
    <div>
        <mt-cell :title="caption" :readonly="readonly">
            <div class="em-select-value mt-color-grey">
                <template>{{display !== undefined ? display : value}}</template>
            </div>
        </mt-cell>
    </div>
</template>

<script>
import FormConnectItem from '../FormConnectItem'

export default {
    name:"mint-fc-static",
    extends: FormConnectItem,
}
</script>

<style>

</style>


