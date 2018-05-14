export default{
    props:{
        datasource: Object,
        autoReadyDataBind: Boolean,
        pageSize: {
            type: Number,
            default: 10
        }
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
        DataBind(params, ctlparams, callback) {
            let that = this;
            this.datasource.inst.pageSize = ctlparams && ctlparams.pageSize || this.pageSize;
            this.datasource.inst.pageNumber = ctlparams && ctlparams.pageNumber || this.pageNumber;
            this.datasource.inst.findAll(params).then(function(datas) {
                if (callback === undefined){
                    that.SetData(datas);
                } else {
                    callback(datas)
                }
            });
        }
    }
}
