<template>
  <img @click="handleClick" class="tg-img" />
</template>
<script>
    export default {
        name: 'tg-img',
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    };
</script>
<style>

</style>