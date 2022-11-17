import type { UserAssociations, UserRegister } from "#/user";
import _axios from "@/plugins/axios";
import {useUserStore} from "@/stores/useUserStore";
import axios from "axios";


// TODO refactor token

// Tokens
export function setTokens(access: string, refresh: string) {
    localStorage.setItem('access', access)
    localStorage.setItem('refresh', refresh)
}

export function removeTokens() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
}

// Set bearer
export function setBearer() {
    const access = localStorage.getItem('access')
    _axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
}

// Remove bearer
/*export function removeBearer() {
    if (_axios.defaults) { _axios.defaults.headers.common['Authorization'] = undefined }
}*/

// Refresh token
export async function refreshToken() {
    const refresh = localStorage.getItem('refresh')
    const access = (await _axios.post('/users/auth/token/refresh/', { refresh })).data.access
    localStorage.setItem('access', access)
}

// Load User
export async function loadUser() {
    const access = localStorage.getItem('access')
    const userStore = useUserStore()
    if (access) {
        try {
            await userStore.getUser()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                try {
                    await refreshToken()
                    await userStore.getUser()
                } catch (error) {
                    await userStore.logOut()
                    // TODO : throw error in component
                    /*notify({
                        type: 'negative',
                        message: 'Votre compte a été déconnecté, veuillez vous reconnecter.'
                    })*/
                }
            }
        }
    }
}

// Register functions
export async function userLocalRegister(newUser: UserRegister) {
    await _axios.post('/users/auth/registration/', newUser)
}

export async function userCASRegister(newUserInfo: string | null) {
    setBearer()
    await _axios.patch('/users/auth/user/', { phone: newUserInfo })
}

export async function userAssociationsRegister(username: string, newUserAssociations: UserAssociations) {
    for (let i = 0; i < newUserAssociations.length; i++) {
        await _axios.post('/users/associations/', {
            user: username,
            association: newUserAssociations[i].id,
            has_office_status: newUserAssociations[i].has_office_status
        })
    }
}

export async function userGroupsRegister(username: string, newUserGroups: number[]) {
    await _axios.post('/users/groups/', {
        user: username,
        groups: newUserGroups,
    })
}

export async function passwordReset(email: string) {
    await _axios.post('/users/auth/password/reset/', { email })
}

export async function passwordResetConfirm(uid: string, token: string, new_password1: string, new_password2: string) {
    await _axios.post('/users/auth/password/reset/confirm/', { uid, token, new_password1, new_password2 })
}
