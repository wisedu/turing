<template>
    <div>
        <div v-for="(item, index) in list" :style="layoutStyle" :key="index">
            <slot name="itemTemplate" :data="item" :index="index" v-if="index%2 === 0"></slot>
            <slot name="alternateTemplate" :data="item" :index="index" v-if="index%2 === 1">
                <slot name="itemTemplate" :data="item" :index="index"></slot>
            </slot>
        </div>
        <div style="clear:both">
            <slot name="pager">
                <button @click="loadmore">加载更多</button>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "tg-listview",
  props: {
    datasource: String,
    layout: String,
    enableInfinite: Boolean,
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data: function() {
    return {
      list: [],
      layoutStyle: {},
      pageNumber: 1
    };
  },
  created: function() {
    switch (this.layout) {
      case "h":
        this.layoutStyle = {
          float: "left"
        };
        break;
      default:
        this.layoutStyle = {};
    }
  },
  mounted: function() {
    var that = this;
    window.turing.dataSources
      .get(this.datasource)
      .findAll({ pageSize: this.pageSize })
      .then(function(datas) {
        that.list = datas.rows;
      });
  },
  methods: {
    loadmore: function() {
      this.pageNumber = this.pageNumber + 1;
      var that = this;
      window.turing.dataSources
        .get(this.datasource)
        .findAll({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize
        })
        .then(function(datas) {
          that.list = that.list.concat(datas.rows);
        });
    }
  }
};
</script>

<style>

</style>
