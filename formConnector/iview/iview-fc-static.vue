<template>
    <div>
        <FormItem :label="caption">
            {{currentValue}}&nbsp;
        </FormItem>
    </div>
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
