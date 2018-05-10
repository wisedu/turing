<template>
  <a @click="handleClick" :href="href" :target="target" class="tg-linkbutton">
    <slot></slot>
  </a>
</template>
<script>
    export default {
        name: 'tg-linkbutton',
        props: {
            href: {
                type: String,
                default: "javascript:void(0);"
            },
            target: {
                type: String,
                default: "_self"
            }
        },
        methods: {
            handleClick(evt) {
                if (this.href === "javascript:void(0);"){
                    this.$emit('click', evt);
                }
            }
        }
    };
</script>