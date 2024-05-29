

const routes = [{
    path:'/',
    component: ()=> import('./components/About.vue')

},{
    path:'/gerakan',
    component: ()=> import('./components/Gerakan.vue')

},
    // not found

]

export default routes;