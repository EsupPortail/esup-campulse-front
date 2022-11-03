import type { RouteRecordRaw } from 'vue-router'


const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Root',
        component: () => import('@/layouts/LayoutDefault.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: 'directory',
                name: 'Directory',
                component: () => import('@/views/HomeView.vue'),
            },
            {
                path: 'charter',
                name: 'Charter',
                component: () => import('@/views/HomeView.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'commission',
                name: 'Commission',
                component: () => import('@/views/HomeView.vue'),
                meta: { requiresAuth: true }
            },
            {
                path: 'login',
                name: 'Login',
                component: () => import('@/views/LoginView.vue'),
            },
            {
                path: 'cas-login',
                name: 'CAS Login',
                component: () => import('@/views/CASLoginView.vue'),
                async beforeEnter(to) {
                    const response = await fetch('http://localhost:8000/users/auth/cas/login/', {
                        method: 'POST',
                        // mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ticket: to.query.ticket,
                            service: "http://localhost:3000/cas-login"
                        })
                    })
                    const data = await response.json();
                    console.log(data);
                    return { name: 'Login' };
                }
            },
            {
                path: 'logout',
                name: 'Logout',
                component: () => import('@/views/LogoutView.vue'),
            },
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/DashboardView.vue'),
            }
        ]
    }
]

export default routes
