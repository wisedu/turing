<template>
  <div @click="handleClick" class="tg-container">
    <slot></slot>
  </div>
</template>
<script>
    export default {
        name: 'tg-container',
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    };
</script>
<style lang="css">
  .tg-container{
    position: relative;
  }

  .tg-container:after{
    content: "";
    display: table;
    clear: both;
  }
</style>
