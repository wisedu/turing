<template>
  <a @click="handleClick" href="javascript:void(0);" class="tg-linkbutton">
    <slot></slot>
  </a>
</template>
<script>
    export default {
        name: 'tg-linkbutton',
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            }
        }
    };
</script>