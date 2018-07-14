export default{
    props:{
        dataAdapter: Object,
        autoReadyDataBind: Boolean,
        params: {
            type: Object,
            default:function() {
                return {};
            }
        },
        pager: {
            type: Object,
            default:function() {
                return {size:5,index:1};
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
            // let that = this;
            // this.datasource.inst.pageSize = ctlparams && ctlparams.pageSize || this.pageSize;
            // this.datasource.inst.pageNumber = ctlparams && ctlparams.pageNumber || this.pageNumber;
            // this.datasource.inst.findAll(params).then(function(datas) {
            //     if (callback === undefined){
            //         that.SetData(datas);
            //     } else {
            //         callback(datas)
            //     }
            // });
            let that = this;
            if (pager_params !== undefined){
                this.pager.size = pager_params.pageSize;
                this.pager.index = pager_params.pageNumber;
                this.$emit("update:pager", this.pager)
            }
            this.dataAdapter.pageSize = this.pager.size;
            this.dataAdapter.pageNumber = this.pager.index;
            this.dataAdapter.findAll(this.params).then(function(datas) {
                if (callback === undefined){
                    that.SetData(datas);
                } else {
                    callback(datas)
                }
            });
        }
    }
}
