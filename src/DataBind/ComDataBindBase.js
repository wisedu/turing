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
        DataBind(params, callback) {
            let that = this;
            let localparam = Object.assign({ pageSize: this.pageSize }, params)
            this.datasource.inst.findAll(localparam).then(function(datas) {
                if (callback === undefined){
                    that.SetData(datas);
                } else {
                    callback(datas)
                }
            });
        }
    }
}
