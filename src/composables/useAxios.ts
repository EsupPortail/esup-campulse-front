import type {AxiosInstance} from 'axios'
import axios from 'axios'
import {reactive} from 'vue'
import {useCasAuthentication} from '@vue-unistra/cas-authentication'
import router from '@/router'


interface UseAxiosState {
    axios: () => AxiosInstance;
    axiosAuth: () => AxiosInstance;
}

const config = {baseURL: import.meta.env.VITE_APP_BASE_URL}

const state = reactive<UseAxiosState>({
    axios: () => axios.create(config),
    axiosAuth: () => {
        const _axios = axios.create(config)
        const {axiosRequestInterceptor} = useCasAuthentication()

        _axios.interceptors.request.use(
            axiosRequestInterceptor({
                axios: _axios,
                router,
                jwtServerUrl: import.meta.env.VITE_APP_BASE_URL + '/users/auth',
                serverCAS: import.meta.env.VITE_APP_CAS_URL,
                options: {
                    appIsAllAuth: false,
                    authCasLogoutUrl: 'Logout',
                    hasFreeAPI: true,
                    loginRoute: {name: 'Login'},
                    loginRouteIsInternal: true
                }
            }),
            error => Promise.reject(error)
        )

        _axios.interceptors.response.use(response => {
            return response
        }, async function (error) {
            if (error.response.status === 401) {
                const refreshToken = localStorage.getItem('JWT__refresh__token')
                const refreshTokenExpired = () => {
                    if (!refreshToken) return true
                    return JSON.parse(window.atob(refreshToken.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
                }
                if (refreshTokenExpired()) {
                    await router.push({name: 'Logout'})
                }
            } else {
                return Promise.reject(error)
            }
        })
        return _axios
    },
})

export const useAxios = () => {
    return {
        axiosPublic: state.axios(),
        axiosAuthenticated: state.axiosAuth(),
    }
}
