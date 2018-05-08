<template>
  <div>
    <div :class="containerClass" :style="containerStyle">
        <div v-for="(item, index) in list" :style="layoutStyle" :class="layoutClassObject" :key="index" >
          <slot name="itemTemplate" :data="item" :index="index"></slot>
        </div>
        <div v-if="list === undefined || list.length === 0">
          <slot name="emptyTemplate">{{emptyText}}</slot>
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
      layoutClassObject: {},
      pageNumber: 1,
      containerClass: "",
      containerStyle: {}
    };
  },
  created: function() {
    if (this.grid) {
      //横向排列模式
      let gutter = isNaN(Number(this.grid.gutter)) ? 0 : Number(this.grid.gutter);
      this.layoutStyle = {
        padding: "" + (gutter/2) + "px"
      }
      this.containerStyle = {
        margin: "0 -"+(gutter/2)+"px"
      }
      if (this.grid.column !== undefined){
        //栅格模式，按照百分比宽度伸缩
        let size = isNaN(Number(this.grid.column)) ? 12 : 12/Number(this.grid.column)
        this.layoutClassObject["tg-col-" + size ] = true
        this.containerClass = 'tg-row';
      } else {
        //定宽模式，slot内控制宽度
        this.layoutStyle["float"] = "left";
      }
    } else {
      //行模式
      this.layoutClassObject = {
        'tg-row': true,
        'tg-br-b-grey-4': this.bordered
      }
      this.layoutClassObject["tg-listview-item-" + this.size] = true;
      this.containerClass = "tg-listview-container-" + this.size
    }
    
  },
  mounted: function() {
    var that = this;
    this.datasource.inst.findAll({ pageSize: this.pageSize })
      .then(function(datas) {
        that.list = datas.rows;
      });
  },
  methods: {
    loadmore: function() {
      var that = this;
      this.datasource.inst.findAll({
          pageNumber: ++this.pageNumber,
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
