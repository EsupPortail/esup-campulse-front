import type {UserAssociations, UserRegister} from '#/user'
import {useAxios} from '@/composables/useAxios'

// Tokens
export function setTokens(access: string, refresh: string) {
    localStorage.setItem('JWT__access__token', access)
    localStorage.setItem('JWT__refresh__token', refresh)
}

export function removeTokens() {
    localStorage.removeItem('JWT__access__token')
    localStorage.removeItem('JWT__refresh__token')
}

// Refresh token
/*export async function refreshToken() {
    const refresh = localStorage.getItem('JWT__refresh__token')
    const {axiosAuthenticated} = useAxios()
    const access = (await axiosAuthenticated.post('/users/auth/token/refresh/', {refresh})).data.access
    localStorage.setItem('access', access)
}*/

/*export async function loadUser() {
    const access = localStorage.getItem('JWT__access__token')
    const userStore = useUserStore()
    if (access && !userStore.user) {
        try {
            // setBearer()
            await userStore.getUser()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                try {
                    await refreshToken()
                    //setBearer()
                    await userStore.getUser()
                } catch (error) {
                    // await userStore.logOut()
                    // TODO : throw error in component
                }
            }
        }
    }
}*/

// Register functions
export async function userLocalRegister(newUser: UserRegister) {
    const {axiosPublic} = useAxios()
    await axiosPublic.post('/users/auth/registration/', newUser)
}

export async function userLocalRegisterAsManager(newUser: UserRegister) {
    const {axiosAuthenticated} = useAxios()
    await axiosAuthenticated.post('/users/', newUser)
}

export async function userCASRegister(newUserInfo: string | null) {
    const {axiosAuthenticated} = useAxios()
    await axiosAuthenticated.patch('/users/auth/user/', {phone: newUserInfo !== "" ? newUserInfo : null})
}

export async function userAssociationsRegister(username: string, newUserAssociations: UserAssociations) {
    const idsAssociations = []
    const {axiosPublic} = useAxios()
    for (let i = 0; i < newUserAssociations.length; i++) {
        if (idsAssociations.indexOf(newUserAssociations[i].id) === -1)
            await axiosPublic.post('/users/associations/', {
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
    const {axiosPublic} = useAxios()
    await axiosPublic.post('/users/groups/', {
        username: username,
        groups: newUserGroups,
    })
}

export async function verifyEmail(key: string) {
    const {axiosPublic} = useAxios()
    await axiosPublic.post('/users/auth/registration/verify-email/', {key: key})
}

export async function resendEmail(email: string) {
    const {axiosPublic} = useAxios()
    await axiosPublic.post('/users/auth/registration/resend-email/', {email})
}

// Password reset functions
export async function passwordReset(email: string) {
    const {axiosPublic} = useAxios()
    await axiosPublic.post('/users/auth/password/reset/', {email})
}

export async function passwordResetConfirm(uid: string, token: string, newPassword1: string, newPassword2: string) {
    const {axiosPublic} = useAxios()
    await axiosPublic.post('/users/auth/password/reset/confirm/', {uid, token, newPassword1, newPassword2})
}
