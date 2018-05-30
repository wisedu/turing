<template>
  <div @click="handleClick" class="tg-left-right" :left="left" :right="right">
    <slot name="left"></slot>
    <slot name="right"></slot>
  </div>
</template>
<script>
    /**
     * <tg-left-right>
        <tg-container slot="left"></tg-container>
        <tg-container slot="right"></tg-container>
     </mt-layout-left-right>
     */
    export default {
        name: 'tg-left-right',
        props: {
            left: String,
            right: String
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            },
            setOtherHalfWidth(width, type){
                let otherWidth = '';
                width = width.replace(/\s/g, '');
                if(this.checkWidth(width)){
                    otherWidth = `calc(100% - ${width})`;
                }else{
                    otherWidth = '50%';
                    width = '50%';
                }

                if(type === 'left'){
                    this.setChildAttr(width, otherWidth);
                }else{
                    this.setChildAttr(otherWidth, width);
                }
            },
            checkWidth(width){
                if(/^\d+(\.?\d+)?(px|%)$/.test(width)){
                    return true;
                }else{
                    return false;
                }
            },
            setChildAttr(left, right){
                this.$slots.left[0].data.attrs.width = left;
                this.$slots.right[0].data.attrs.width = right;
            }
        },
        created: function () {
            let left = this.left || '';
            let right = this.right || '';
            if(left && right){
                this.setChildAttr(left, right);
            }else if(left){
                this.setOtherHalfWidth(left, 'left');
            }else if(right){
                this.setOtherHalfWidth(right, 'right');
            }else{
                this.setChildAttr('50%', '50%');
            }
        }
    };

</script>
<style lang="css">
  .tg-left-right{
    position: relative;
  }

  .tg-left-right:after{
    content: "";
    display: table;
    clear: both;
  }

</style>
