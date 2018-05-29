<template>
    <div>
        <Form :model="formValue" :label-width="labelWidth">
            <tg-listview :datas="model" :grid="{gutter:0, column:column}">
                <template slot="beforeTemplate">
                    <slot name="before"></slot>
                </template>
                <template slot="itemTemplate" slot-scope="props">
                    
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

}
</script>

<style>

</style>
