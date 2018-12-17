<template>
  <i @click="handleClick" class="tg-icon" :class="type"></i>
</template>
<script>
    export default {
        name: 'tg-icon',
        props: {
            type: String
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    };
</script>
<style>
  .tg-icon{
    display: inline-block;
  }
</style>