import {inject, reactive} from 'vue'
import type {AxiosInstance} from 'axios'
import axios from 'axios'
import type {axiosRequestInterceptor} from "@vue-unistra/cas-authentication";

export interface SecurityStoreState {
    axiosAuthenticated: () => AxiosInstance;
    axiosPublic: AxiosInstance;
}

const config = {
    baseURL: import.meta.env.VITE_APP_BASE_URL as string,
}

const state = reactive<SecurityStoreState>({
    axiosAuthenticated: () => {
        const axiosCreated = axios.create(config)
        const interceptor = inject('axiosRequestInterceptor') as typeof axiosRequestInterceptor
        axiosCreated.interceptors.request.use(interceptor)
        console.log(interceptor)

        return axiosCreated
    },
    axiosPublic: axios.create(config),
})

export const useAxios = () => {
    return {
        axiosAuthenticated: state.axiosAuthenticated(),
        axiosPublic: state.axiosPublic,
    }
}

