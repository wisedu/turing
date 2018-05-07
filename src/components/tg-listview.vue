<template>
    <div :class="containerClass">
        <div v-for="(item, index) in list" :style="layoutStyle" :key="index" >
            <div class="tg-row" :class="itemClassObject">
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
    bordered: Boolean,
    size: {
      type: String,
      default: "default"
    },
    emptyText: {
      type: String,
      default: "暂无数据"
    },
    pagination: Boolean,
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
      containerClass: "",
      itemClass: ""
    };
  },
  computed: {
    itemClassObject: function () {
      let co = {
        'tg-br-b-grey-4':this.bordered
      }
      co[this.itemClass] = true;
      return co;
    }
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
    this.itemClass = "tg-listview-item-" + this.size
    this.containerClass = "tg-listview-container-" + this.size
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
.tg-listview-item-small{
  padding: 8px 0;
}
.tg-listview-item-default{
  padding: 12px 0;
}
.tg-listview-item-large{
  padding: 16px 0;
}
.tg-listview-container-small{
  padding:0 8px;
}
.tg-listview-container-default{
  padding:0 12px;
}
.tg-listview-container-large{
  padding:0 16px;
}
</style>
