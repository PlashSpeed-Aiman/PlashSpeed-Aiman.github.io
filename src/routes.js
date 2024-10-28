const routes = [
    {
    path: '/',
    component: () => import('./components/About.vue')
    },
    {
    path: '/gerakan',
    component: () => import('./components/Gerakan.vue')
    },
    {
        path: '/qr',
        component: () => import('./components/QrGenerator.vue')
    },
    {
        path: '/whatsapp-tool',
        component: () => import('./components/WhatsApp.vue')
    }
    // not found

]

export default routes;