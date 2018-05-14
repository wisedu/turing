
const Index = resolve => require(['./pages/index/index.vue'], resolve)
const DataSource = resolve => require(['./pages/index/datasource.vue'], resolve)
const cleanExample = resolve => require(['./pages/index/cleanExample.vue'], resolve)
const Font = resolve => require(['./pages/index/font.vue'], resolve)
export default {
    routes: [
        { path: '/', component: Index },
        { path: '/ds', component: DataSource },
        { path: '/font', component: Font },
        { path: '/ce', component: cleanExample },
    ]
};