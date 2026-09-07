const routes = [
    {
    path: '/',
    component: () => import('./components/About.vue')
    },
    {
    path: '/lib-dir',
    component: () => import('./components/LibDir.vue')
    },
    {
    path: '/gerakan',
    component: () => import('./components/Gerakan.vue')
    },
    {
        path: '/activities',
        component: () => import('./components/Activities.vue')
    },
    {
        path: '/qr',
        component: () => import('./components/QrGenerator.vue')
    },
    {
        path: '/whatsapp-tool',
        component: () => import('./components/WhatsApp.vue')
    },
    {
        path: '/blog',
        component: () => import('./components/Blog.vue')
    },
    {
        path: '/blog/:slug',
        component: () => import('./components/BlogPost.vue')
    }
    // not found

]

export default routes;