<template>
    <div class="tg-toolbar tg-clear">
        <div class="tg-left">
            <slot name="left"></slot>
        </div>
        <div class="tg-right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name:"tg-toolbar",
    // data(){
    //     let authkeys = [];
    //     let authkeys_str = window.sessionStorage.getItem("tg-authkeys");
    //     if (authkeys_str !== undefined && authkeys_str !== null) {
    //         authkeys = authkeys_str.split(",")
    //     }
    //     return {
    //         authkeys: authkeys
    //     }
    // },
    // mounted(){
    //     console.log("tg-toolbar left:", this.$slots.left[0])
    //     if (this.$slots.left[0].children !== undefined) {
    //         authFilter(this.$slots.left[0].children, this.authkeys);
    //     }
    //     if (this.$slots.right[0].children !== undefined) {
    //         authFilter(this.$slots.right[0].children, this.authkeys);
    //     }
    // }
}

// function authFilter(vnodes, authkeys){
//     vnodes.map(item => {
//         if (item.data !== undefined && item.data.attrs.authkey !== undefined) {
//             ctl_authkeys = item.data.attrs.authkey.split(",");
//         }
//         if (item.children !== undefined) {
//             authFilter(item.children, authkeys);
//         }
//     })
// }

</script>

<style>
.tg-toolbar{
    width: 100%;
    margin-bottom: 12px;
}
</style>
