<template>
  <div @click="handleClick" class="tg-left-right-item" :style="_style" >
      <slot></slot>
  </div>
</template>
<script>
    /**
     * @noteType component
     * @name LayoutLeftRightItem
     * @tagName mt-layout-left-right-item
     * @desc 左右布局容器节点
     * @type container
     * @wrapClassName mint-layout-lr-item
     * @noDisplayInComponents true
     * @html
     * <mt-layout-left-right-item slot="left" position="left"></mt-layout-left-right-item>
     */
export default {
  name: 'tg-left-right-item',
        data: function () {
            return {
                _style: {}
            }
        },
    methods: {
        handleClick(evt) {
            this.$emit('click', evt);
        }
    },
    created: function () {
        let attrs = this.$attrs;
        this._style = {width: attrs.width};
    }
};
</script>
<style lang="css">
    .tg-left-right-item{
        position: relative;
        float: left;
    }

    .tg-left-right-item:after{
        content: "";
        display: table;
        clear: both;
    }
</style>
