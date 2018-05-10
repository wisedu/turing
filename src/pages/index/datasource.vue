<template>
  <div></div>
</template>

<script>
import dataStrcExample from "../../ComAdapter/dataStrcExample";
import { DataAdapter } from "../../DataBind/DataAdapter";
import { EMAPFieldFilter } from "../../DataBind/EMAPFieldFilter";
export default {
    created(){
        let da = new DataAdapter();
        da.setMeta(dataStrcExample);
    }
}
</script>

<style>

</style>
