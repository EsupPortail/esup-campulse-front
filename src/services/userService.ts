import axios from 'axios'

import type { UserAssociations, UserRegister } from '#/user'
import _axios from '@/plugins/axios'
import { useUserStore } from '@/stores/useUserStore'

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
    if (_axios.defaults?.headers) {
        _axios.defaults.headers.common['Authorization'] = 'Bearer ' + access
    }
}

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
            setBearer()
            await userStore.getUser()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                try {
                    await refreshToken()
                    setBearer()
                    await userStore.getUser()
                } catch (error) {
                    await userStore.logOut()
                    // TODO : throw error in component
                }
            }
        }
    }
}

// Register functions
export async function userLocalRegister(newUser: UserRegister) {
    await _axios.post('/users/auth/registration/', newUser)
}

export async function userLocalRegisterAsManager(newUser: UserRegister) {
    await _axios.post('/users/', newUser)
}

export async function userCASRegister(newUserInfo: string | null) {
    setBearer()
    await _axios.patch('/users/auth/user/', { phone: newUserInfo !== "" ? newUserInfo : null })
}

export async function userAssociationsRegister(username: string, newUserAssociations: UserAssociations) {
    const idsAssociations = []
    for (let i = 0; i < newUserAssociations.length; i++) {
        if (idsAssociations.indexOf(newUserAssociations[i].id) === -1)
            await _axios.post('/users/associations/', {
                user: username,
                association: newUserAssociations[i].id,
                roleName: newUserAssociations[i].roleName,
                hasOfficeStatus: newUserAssociations[i].hasOfficeStatus,
                isPresident: newUserAssociations[i].isPresident
            })
        idsAssociations.push(newUserAssociations[i].id)
    }
}

export async function userGroupsRegister(username: string, newUserGroups: number[] | undefined) {
    await _axios.post('/users/groups/', {
        username: username,
        groups: newUserGroups,
    })
}

export async function verifyEmail(key: string) {
    await _axios.post('/users/auth/registration/verify-email/', { key: key })
}

export async function resendEmail(email: string) {
    await _axios.post('/users/auth/registration/resend-email/', { email })
}

// Password reset functions
export async function passwordReset(email: string) {
    await _axios.post('/users/auth/password/reset/', { email })
}

export async function passwordResetConfirm(uid: string, token: string, newPassword1: string, newPassword2: string) {
    await _axios.post('/users/auth/password/reset/confirm/', { uid, token, newPassword1, newPassword2 })
}
