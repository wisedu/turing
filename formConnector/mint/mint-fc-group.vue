<template>
    <div>
        <mt-cell-group :title="name">
            <slot></slot>
        </mt-cell-group>
        <label>{{desc}}</label>
    </div>
</template>

<script>
export default {
    name:"mint-fc-group",
    props: {
        name: String,
        desc: String
    }
}
</script>

<style>

</style>
