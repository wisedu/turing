
const Index = resolve => require(['./pages/index/index.vue'], resolve)
export default {
    routes: [
        { path: '/', component: Index },
    ]
};