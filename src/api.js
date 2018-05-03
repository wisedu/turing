/**
 * WEBPACK_CONIFG_HOST的值，在webpack.config.js中更改
 * 开发环境时 = "http://amptest.wisedu.com/xsfwfw/"
 * 发布环境时 = location.origin + location.pathname.substring(0, location.pathname.indexOf("/", 1)) + "/"
 */

export default {
    getWechatSign: 'http://res.wisedu.com:9090/checkSign',
    weeklist: WEBPACK_CONIFG_HOST + '/sys/mykbxt/api/getMyTimeTableList.do',
    daylist: WEBPACK_CONIFG_HOST + '/sys/mykbxt/api/queryDayAndFutureCourses.do',
    week: WEBPACK_CONIFG_HOST + '/sys/mykbxt/api/getSchoolCalendar.do',
    memberList: WEBPACK_CONIFG_HOST + '/sys/mykbxt/api/queryCourseMembers.do',
    geterr: WEBPACK_CONIFG_HOST + '/sys/mykbxt/api/queryErrorMessages.do',
    err: WEBPACK_CONIFG_HOST + '/sys/mykbxt/api/feedBackInfo.do',
    userInfo: WEBPACK_CONIFG_HOST + '/sys/itservicecommon/api/queryAppAndUserDatas.do'
}
