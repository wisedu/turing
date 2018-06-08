<template>
    <FormItem :label="caption">
        {{value}}&nbsp;
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

</style>
