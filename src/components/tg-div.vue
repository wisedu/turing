<template>
  <div @click="handleClick" class="tg-div">
    <slot></slot>
  </div>
</template>
<script>
    export default {
        name: 'tg-div',
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    };
</script>
<style lang="css">
    .tg-div {
        position: relative;
    }

    .tg-div:after{
        content: "";
        display: table;
        clear: both;
    }

</style>