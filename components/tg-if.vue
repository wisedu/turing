<template>
  <div v-if="value" class="tg-if">
    <slot></slot>
  </div>
</template>
<script>
    export default {
        name: 'tg-if',
        methods: {
            
        },
        props: {
            value: {
                type:Boolean,
                default: true
            }
        }
    };
</script>
<style>


</style>