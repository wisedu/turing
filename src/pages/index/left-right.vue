<template>
    <div>
        <tg-left-right left="40px">
            <tg-left-right-item position="left" slot="left">left</tg-left-right-item>
            <tg-left-right-item position="right" slot="right">right</tg-left-right-item>
        </tg-left-right>
    </div>
</template>

<script>
    import TgLeftRight from "../../../components/tg-left-right";
    import TgContainer from "../../../components/tg-container";
    import TgLeftRightItem from "../../../components/tg-left-right-item";
    export default {
        components: {
            TgLeftRightItem,
            TgContainer,
            TgLeftRight},
        data(){
            return {
            }
        }
    }
</script>

<style>

</style>
