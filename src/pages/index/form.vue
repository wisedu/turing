<template>
    <div>
        <tg-form :fields="fields" type="iview" :column=4 v-model="data" displayFieldFormat="_DISPLAY">
            <div slot="CYM">
                <div>123</div>
                <div>456</div>
            </div>
            <div slot="XZNJ">
                <div>aaa</div>
                <div>456</div>
            </div>
        </tg-form>
        <hr>
        <tg-form :fields="fields_scd" type="iview" :column=4 v-model="data" displayFieldFormat="_DISPLAY">
            <div slot="CYM">
                <div>123</div>
                <div>456</div>
            </div>
            <div slot="XBDM">
                <div>aaa</div>
                <div>456</div>
            </div>
        </tg-form>
    </div>
</template>

<script>
import Student from "../../models/Student";
import TgForm from '../../../components/tg-form'
let inst = new Student();
export default {
    data(){
        return {
            fields: inst.view("默认表单:form"),
            fields_scd: inst.view("search"),
            param:{
                append:"11"
            },
            data:{"CSRQ":"1989-01-02","ZYDM":"5203","XYZJDM":"10","PYFSDM_DISPLAY":"定向","XQDM":"02","HKSZD":"江苏省","SYDDM_DISPLAY":"北京市","GATQDM_DISPLAY":"","XXXSDM":"1","WXH":"123123123","ZZMMDM_DISPLAY":"中共党员","TZ":72.0,"SFZJLXDM":"1","XYZJDM_DISPLAY":"佛教","XSLXDM_DISPLAY":"专科","XBDM":"1","RXNY":"2010-09","LXDH":"12234","LWDBRQ":"2017-09-05","SJH":"17350599171","XH":"121102043832","BJDM_DISPLAY":"13园艺专升本2班","XM":"\u003cs cript\u003ealert(123)\u003c/scrip t\u003e","HYZKDM":"10","PYCCDM":"1","JG_DISPLAY":"河北省/唐山市/市辖区","PYFSDM":"12","SFZJLXDM_DISPLAY":"居民身份证","XJZTDM":"1","XSLXDM":"1","ZYDLDM_DISPLAY":"经济学","DWDM_DISPLAY":"园艺学院","GJDQDM_DISPLAY":"","XSZP":"1500276826913751","YJBYRQ":"2017-09-19","JTDZQH":"110101","RXJJDM_DISPLAY":"","HYZKDM_DISPLAY":"未婚","SSL_DISPLAY":"","KSH":"103213234534091","SFZJH":"12","MZDM":"01","XSLBDM_DISPLAY":"本专科生","XXDM_DISPLAY":"未知血型","DWDM":"00000029","SSQ_DISPLAY":"","CCQJ_DISPLAY":"山东","CSDDM_DISPLAY":"北京市/市辖区/东城区","JTYB":"264001","XZ":"2","DSZGH":"334","XXXSDM_DISPLAY":"全日制","ZYDM_DISPLAY":"园艺（专升本）","XXDM":"0","SFDSZN_DISPLAY":"","XSBH":"121102043832","ZYDLDM":"02","CZZ":"ampadmin","CZRQ":"Jun 9, 2018 10:41:04 AM","JG":"130201","CCQJ":"山东","ZZMMDM":"01","WID":"1E2F635585BC8771E050007F0100645A","KSLBDM_DISPLAY":"","ZSDZ":"888888888","JTDZ":"asfasfafasf","XJZTDM_DISPLAY":"复学","JKZKDM_DISPLAY":"","XQDM_DISPLAY":"西校区","CZZXM":"ampadmin","HKXZDM_DISPLAY":"","DZXX":"150505@wisedu.com","RXFSDM_DISPLAY":"","SJBYRQ":"2015-01-01","TC":"腿长","CYM":"1111","SG":"174","PYCCDM_DISPLAY":"博士生","CSDDM":"110101","JTDZQH_DISPLAY":"北京市/市辖区/东城区","QQH":"12313123","BJDM":"52031302","XMPY":"xingm","SYDDM":"110000","XBDM_DISPLAY":"男","XSLBDM":"3","XZNJ":"2013","JTDH":"123456789","MZDM_DISPLAY":"汉族"}
        }
    },
    components: {
        TgForm,
    },
}
</script>

<style>

</style>
