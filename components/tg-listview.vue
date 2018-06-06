<template>
  <div class="tg-listview-root">
    <div :class="containerClass" :style="containerStyle">
        <slot name="beforeTemplate"></slot>
        <div v-for="(item, index) in list" v-if="item._lv_hidden !== true" :style="layoutStyle" :class="layoutClassObject" :key="index" >
          <slot name="itemTemplate" :data="item" :index="index"></slot>
        </div>
        <div v-if="list === undefined || list.length === 0">
          <slot name="emptyTemplate">暂无数据</slot>
        </div>
        <slot name="afterTemplate"></slot>
    </div>
    <div style="clear:both">
        <slot name="pagerTemplate" v-if="pagination">
            <button @click="LoadMore">加载更多</button>
        </slot>
    </div>
  </div>
</template>

<script>
import ComDataBindBase from './ComDataBindBase'
export default {
  extends: ComDataBindBase,
  name: "tg-listview",
  props: {
    datas: Array,
    grid: Object,
    bordered: Boolean,
    pagination: Boolean,
    size: {
      type: String,
      default: "default"
    },
  },
  data: function() {
    return {
      list: [],
      layoutStyle: {},
      layoutClassObject: {},
      containerClass: "",
      containerStyle: {},
    };
  },
  created: function() {
    if (this.grid) {
      //横向排列模式
      let gutter = 0;
      switch (typeof(this.grid.gutter)){
        case "number":
          gutter = isNaN(Number(this.grid.gutter)) ? 0 : Number(this.grid.gutter);
          this.layoutStyle = {
            padding: "" + (gutter/2) + "px"
          }
          break;
        case "string":
          //字符串类型必须最少输入 "0 2px"，取第二位作为左右边距
          gutter = this.grid.gutter.split(" ")[1].replace("px", "")
          this.layoutStyle = {
            padding: this.grid.gutter
          }
          break;
      }
      
      this.containerStyle = {
        margin: "0 -"+gutter+"px"
      }
      
      if (this.grid.column !== undefined){
        //栅格模式，按照百分比宽度伸缩
        let size = isNaN(Number(this.grid.column)) ? 24 : 24/Number(this.grid.column)
        this.layoutClassObject["tg-col-" + size ] = true
        this.containerClass = 'tg-row';
      } else {
        //定宽模式，slot内控制宽度
        this.layoutStyle["float"] = "left";
        this.containerClass = 'tg-clear';
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
    this.$emit("ready", this)
    if (this.autoReadyDataBind === true) {
      this.DataBind()
    } else {
      if (this.datas && this.datas.length > 0) {
        this.list = this.datas;
      }
    }
  },
  // watch: {
  //   datas: function(val) {
  //     this.list = val;
  //   }
  // },
  methods: {
    SetData(datas) {
      this.list = datas.rows;
    },
    LoadMore() {
      var that = this;
      this.DataBind({}, {
          pageNumber: ++this.pageNumber,
          pageSize: this.pageSize
        }, function(datas) {
          that.list = that.list.concat(datas.rows);
        })
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
.tg-listview-root{
  overflow-x: hidden;
}
</style>
