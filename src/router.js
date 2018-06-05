
const Index = resolve => require(['./pages/index/index.vue'], resolve)
const Font = resolve => require(['./pages/index/font.vue'], resolve)
// const addressList = resolve => require(['./pages/index/addressList.vue'], resolve)
const leftRight = resolve => require(['./pages/index/left-right.vue'], resolve)
export default {
    routes: [
        { path: '/left-right', component: leftRight },
        // { path: '/address', component: addressList },
        { path: '/font', component: Font },
        { path: '/', component: Index },
    ]
};