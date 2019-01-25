export default{
    props:{
        datasource: Object,//被弃用
        dataAdapter: Object,
        autoReadyDataBind: Boolean,
        loading: {
            type:Boolean,
            default: false
        },
        // params: {
        //     type: Object,
        //     default:function() {
        //         return {};
        //     }
        // },
        pager: {
            type: Object,
            default:function() {
                return {size:10,index:1};
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
        DataBind(query_params = {}, callback) {
            let that = this;
            this.$emit("update:loading", true);
            if (this.datasource !== undefined) {    //后续将不再支持
                this.datasource.inst.pageSize = query_params && query_params.pageSize || this.pageSize;
                this.datasource.inst.pageNumber = query_params && query_params.pageNumber || this.pageNumber;
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

            if (query_params.pageSize !== undefined || query_params.pageNumber !== undefined){
                this.pager.size = query_params.pageSize;
                this.pager.index = query_params.pageNumber;
                this.$emit("update:pager", query_params);
            }
            this.dataAdapter.pageSize = query_params && query_params.pageSize || this.pager.size;
            this.dataAdapter.pageNumber = query_params && query_params.pageNumber || this.pager.index;
            this.dataAdapter.timeOut = this.timeOut;
            this.dataAdapter.findAll(query_params.params).then(function(datas) {
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
