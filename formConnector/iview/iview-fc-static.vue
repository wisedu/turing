<template>
    <FormItem :label="caption">
        <div class="iview-fc-static-readonly">{{value}}&nbsp;</div>
    </FormItem>
</template>

<script>
import FormConnectItem from '../FormConnectItem'

export default {
    name:"iview-fc-static",
    extends: FormConnectItem,
}
</script>

<style>
.iview-fc-static-readonly{
    padding-left: 8px;
}
</style>
