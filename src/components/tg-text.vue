<template>
  <div @click="handleClick">
    <pre v-if="wordwrap"><slot></slot></pre>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'tg-text',
    methods: {
        handleClick(evt) {
            this.$emit('click', evt);
        }
    },
  props: {
      wordwrap: {
        type: Boolean,
        default: false
      }
  }
};
</script>