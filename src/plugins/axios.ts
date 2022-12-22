import axios from 'axios'
import {refreshToken, setBearer} from '@/services/userService'

const config = {
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    // timeout: 60 * 1000, // Timeout
    // withCredentials: true, // Check cross-site Access-Control
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
    function (config) {
        // only set if access ?
        // setBearer()
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
    async function (error) {
        const originalRequest = error.config
        if (axios.isAxiosError(error) && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            await refreshToken()
            setBearer()
            return _axios(originalRequest)
        }
        return Promise.reject(error)
    }
)

export default _axios
