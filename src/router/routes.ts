import type { RouteRecordRaw } from 'vue-router'
import _axios from '@/plugins/axios'
import router from '@/router/index'


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
                name: 'CASLogin',
                component: () => import('@/views/CASLoginView.vue'),
                beforeEnter(to) {
                    _axios({
                        method: 'post',
                        url: '/users/auth/cas/login/',
                        data: {
                            ticket: to.query.ticket,
                            service: 'http://localhost:3000/cas-login'
                        },
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(response => {
                        const {access_token, refresh_token, user} = response.data
                        console.log(user)
                        localStorage.setItem('access', access_token)
                        localStorage.setItem('refresh', refresh_token)
                    }).then(() => (
                        router.push({name: 'Home'})
                    ))
                }
                // old code using fetch
                /*async beforeEnter(to) {
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
                }*/
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
