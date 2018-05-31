
const Index = resolve => require(['./pages/index/index.vue'], resolve)
const DataSource = resolve => require(['./pages/index/datasource.vue'], resolve)
const cleanExample = resolve => require(['./pages/index/cleanExample.vue'], resolve)
const Font = resolve => require(['./pages/index/font.vue'], resolve)
const addressList = resolve => require(['./pages/index/addressList.vue'], resolve)
const leftRight = resolve => require(['./pages/index/left-right.vue'], resolve)
export default {
    routes: [
        { path: '/left-right', component: leftRight },
        { path: '/address', component: addressList },
        { path: '/font', component: Font },
        { path: '/ds', component: DataSource },
        { path: '/ce', component: cleanExample },
        { path: '/', component: Index },
    ]
};