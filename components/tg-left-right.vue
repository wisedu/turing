<template>
  <div @click="handleClick" class="tg-left-right" :left="left" :right="right">
    <slot name="left" :style="leftStyle"></slot>
    <slot name="right" :style="rightStyle"></slot>
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
        data: function() {
            return {
                leftStyle: '',
                rightStyle: ''
            };
        },
        methods: {
            handleClick(evt) {
                this.$emit('click', evt);
            },
            setOtherHalfWidth(width, type){
                let otherType = type === 'left' ? 'right': 'left';
                let otherWidth = '';

                width = width.replace(/\s/g, '');
                if(this.check(width)){
                    otherWidth = `calc(100% - ${width})`;
                }else{
                    otherWidth = '50%';
                    width = '50%';
                }

                this[`${type}Style`] = width;
                this[`${otherType}Style`] = otherWidth;
            },
            checkWidth(width){
                if(/^\d+(\.?\d+)?(px|%)$/.test(width)){
                    return true;
                }else{
                    return false;
                }
            }
        },
        created: function () {
            let left = this.left || '';
            let right = this.right || '';
            if(left && right){
                this.leftStyle = left;
                this.rightStyle = right;
            }else if(left){
                this.setOtherHalfWidth(left, 'left');
            }else if(right){
                this.setOtherHalfWidth(right, 'right');
            }else{
                this.leftStyle = '50%';
                this.rightStyle = '50%';
            }
        }
    };

</script>
<style lang="css">
  .tg-left-right{
    position: relative;
  }

  .tg-left-right > *{
    float: left;
  }

  .tg-left-right:after{
    content: "";
    display: table;
    clear: both;
  }

</style>
