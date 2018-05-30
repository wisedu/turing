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
            getOtherHalfWidth(width){
                width = width.replace(/\s/g, '');
                
            }
        },
        created: function () {
            let left = this.left;
            let right = this.right;
            if(left && right){
                this.leftStyle = left;
                this.rightStyle = right;
            }else if(left){

            }else if(right){

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
