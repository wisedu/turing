<template>
    <div>
        <h4>{{name}}</h4>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name:"iview-fc-group",
    props: {
        name: String,
        desc: String
    }
}
</script>

<style>

</style>
