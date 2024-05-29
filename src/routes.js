import About from "./components/About.vue";


const routes = [{
    path:'#/',
    component: About

},{
    path:'#/gerakan',
    component: ()=> import('./components/Gerakan.vue')

},
    // not found

]

export default routes;