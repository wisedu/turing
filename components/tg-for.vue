<template>
  <div class="tg-for">
    <div v-if="isArray" v-for="(item, index) in list" class="tg-for-item" :key="index" >
        <slot :data="item" :index="index"></slot>
    </div>
    <div v-else v-for="(val, key, index) in list" class="tg-for-item" :key="index" >
        <slot :data="val" :key="key" :index="index"></slot>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'tg-for',
        data(){
            return {
                isArray:true
            }
        },
        watch:{
            list(newVal, oldVal){
                if(Array.isArray(newVal)){
                    this.isArray = true;
                }else {
                    this.isArray = false;
                }
            }
        },
        methods: {
            
        },
        props: {
            list: {
                type:Array|Object,
                default: []
            }
        }
    };
</script>
<style>


</style>