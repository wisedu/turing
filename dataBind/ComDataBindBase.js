export default{
    props:{
        datasource: Object,//被弃用
        dataAdapter: Object,
        autoReadyDataBind: Boolean,
        loading: {
            type:Boolean,
            default: false
        },
        params: {
            type: Object,
            default:function() {
                return {};
            }
        },
        pager: {
            type: Object,
            default:function() {
                return {size:20,index:1};
            }
        },
    },
    data: function(){
        return {
            pageNumber: 1
        }
    },
    methods:{
        SetData(){
            console.warn("需要在组件中实现该方法")
        },
        DataBind(pager_params, callback) {
            let that = this;
            this.$emit("update:loading", true);
            if (this.datasource !== undefined) {    //后续将不再支持
                this.datasource.inst.pageSize = pager_params && pager_params.pageSize || this.pageSize;
                this.datasource.inst.pageNumber = pager_params && pager_params.pageNumber || this.pageNumber;
                this.datasource.inst.findAll(this.params).then(function(datas) {
                    that.$emit("update:loading", false);
                    that.$emit('data-loaded', datas);
                    if (callback === undefined){
                        that.SetData(datas);
                    } else {
                        callback(datas)
                    }
                });
                return;
            }

            if (pager_params !== undefined){
                // this.pager = pager_params;
                this.$emit("update:pager", pager_params)
            }
            this.dataAdapter.pageSize = pager_params && pager_params.pageSize || this.pager.size;
            this.dataAdapter.pageNumber = pager_params && pager_params.pageNumber || this.pager.index;
            this.dataAdapter.findAll(this.params).then(function(datas) {
                that.$emit("update:loading", false);
                that.$emit('data-loaded', datas);
                if (callback === undefined){
                    that.SetData(datas);
                } else {
                    callback(datas)
                }
            });
        }
    }
}
