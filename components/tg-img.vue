<template>
  <img @click="handleClick" :src="src" :type="type" class="tg-img" />
</template>
<script>
    export default {
        name: 'tg-img',
        props: {
            src: String,
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
  .tg-img{
    display: inline-block;
  }

  .tg-img[type="circular"]{
    border-radius: 100%;
  }
</style>