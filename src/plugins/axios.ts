/*import type {AxiosInstance} from 'axios'
import axios from 'axios'
import {reactive, toRefs} from 'vue'

export interface SecurityStoreState {
    axiosAuthenticated: AxiosInstance,
    axiosPublic: AxiosInstance,
}

const config = {
    baseURL: import.meta.env.VITE_APP_BASE_URL
}

const state = reactive<SecurityStoreState>({
    axiosAuthenticated: axios.create(config),
    axiosPublic: axios.create(config),
})

export const useAxios = () => {
    return {
        ...toRefs(state),
    }
}*/


/*_axios.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error)
    },
)

// Add a response interceptor
_axios.interceptors.response.use(
    function (response) {
        // Do something with response data
        return response
    },
    function (error) {
        // Do something with response error
        return Promise.reject(error)
    },
)*/

// ////////////////////////////////////////////////////////////////////////////////////////// OLD

/*const config = {
    baseURL: import.meta.env.VITE_APP_BASE_URL
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
    function(config) {
        // Do something before request is sent
        return config
    },
    function(error) {
        // Do something with request error
        return Promise.reject(error)
    },
)

// Add a response interceptor
_axios.interceptors.response.use(
    function(response) {
        // Do something with response data
        return response
    },
    function(error) {
        // Do something with response error
        return Promise.reject(error)
    },
)

export default _axios*/
