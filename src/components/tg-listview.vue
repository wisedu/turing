<template>
    <div>
        <div v-for="(item, index) in list" :style="layoutStyle" :key="index" >
            <div class="tg-row tg-br-b-grey-4" :style="itemStyle">
              <slot name="itemTemplate" :data="item" :index="index"></slot>
            </div>
        </div>
        <div style="clear:both">
            <slot name="pager" v-if="pagination">
                <button @click="loadmore">加载更多</button>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "tg-listview",
  props: {
    grid: Object,
    datasource: Object,
    layout: String,
    enableInfinite: Boolean,
    bordered: {
      type:Boolean,
      default: false
    },
    size: {
      type: String,
      default: "default",
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['small', 'default', 'large'].indexOf(value) !== -1
      }
    },
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    pagination: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data: function() {
    return {
      list: [],
      layoutStyle: {},
      pageNumber: 1,
      itemStyle: {width:"100%"}
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
    switch (this.size) {
      case "small":
        this.itemStyle.padding = "8px";
        break;
      case "large":
        this.itemStyle.padding = "16px";
        break;
      default:
        this.itemStyle.padding = "12px";
    }
  },
  mounted: function() {
    var that = this;
    this.datasource.inst.findAll({ pageSize: this.pageSize })
      .then(function(datas) {
        let b = "";
        that.list = datas.rows;
      });
  },
  methods: {
    loadmore: function() {
      this.pageNumber = this.pageNumber + 1;
      var that = this;
      this.datasource.inst.findAll({
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
