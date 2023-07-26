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
                options: {
                    loginRoute: {name: 'Login'},
                    loginRouteIsInternal: true
                }
            },
            ),
            error => Promise.reject(error),
        )

        _axios.interceptors.response.use(response => {
            return response
        }, async function (error) {
            if (401 === error.response.status) {
                localStorage.removeItem('JWT__access__token')
                localStorage.removeItem('JWT__refresh__token')
                await router.push({name: 'Login'})
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
