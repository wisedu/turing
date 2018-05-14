import iviewAdapter from "../../ComAdapter/iviewAdapter";
import { DataAdapter } from "../../DataBind/DataAdapter";
export default class{
    constructor(){
        this.dataAdapter = new DataAdapter();
        let struct = {
            "default":{
                XSBH:{caption:"学生编号"},
                XH:{caption:"学号"},
                XM:{caption:"姓名"},
                XBDM:{caption:"性别代码"},
                CSRQ:{caption:"出生日期"}
            },
            "grid":{
                XSBH:{},
                XH:{width:200},
                XM:{},
                XBDM:{width:120},
                CSRQ:{}
            },
            "form":{
                XSBH:{placeholder:"111"},
                XH:{},
                XM:{},
                XBDM:{xtype:"select",options:["男","女"]},
                CSRQ:{}
            },
            "search":{
                // name:{quickSearch:true}
                // status:{}
            }
        }
        this.dataAdapter.actions.find.url = "/static/json/student.json";
        this.dataAdapter.actions.find.method = "get"
        this.dataAdapter.actions.save.url = "/api/student/save";
        this.dataAdapter.actions.delete.url = "/api/student";
        this.dataAdapter.actions.delete.method = "delete"
        
        this.dataAdapter.setMeta(struct);
    }
    meta(metaid, iviewtype, params) {
        return iviewAdapter(iviewtype, this.dataAdapter.getMeta(metaid), params);
    }
    findAll(params) {
        return this.dataAdapter.findAll(params)
    }
    save(data) {
        return this.dataAdapter.save(data)
    }
    delete(id) {
        this.dataAdapter.actions.delete.url += "/" + id;
        return this.dataAdapter.delete()
    }
}