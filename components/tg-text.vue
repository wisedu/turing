<template>
  <span @click="handleClick" :class="isCutStr" :is-cut="cut" class="tg-text">
    <pre v-if="wordwrap"><slot></slot></pre>
    <slot v-else></slot>
  </span>
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
      },
      cut: {
        type: Boolean,
        default: true
      }
  },
    computed: {
        isCutStr: function () {
            let cutClass = '';
            if(!this.wordwrap){
                if(this.cut){
                    cutClass = 'tg-cut-str';
                }
            }
            return cutClass;
        }
    }
};
</script>

<style>
  .tg-text[is-cut]{
    display: inline-block;
  }
</style>