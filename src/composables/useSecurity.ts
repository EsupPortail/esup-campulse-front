import {reactive, ref, watch} from 'vue'
import type {AssociationUser, LocalLogin, UserGroupRegister, UserRegister} from '#/user'
import useAssociation from '@/composables/useAssociation'
import useUserGroups from '@/composables/useUserGroups'
import {useUserStore} from '@/stores/useUserStore'
import {useAxios} from '@/composables/useAxios'
import {useRoute} from "vue-router";
import type {AxiosInstance} from "axios";


export default function () {

    const userStore = useUserStore()

    // Used for local login
    const user = ref<LocalLogin>({
        username: '',
        password: ''
    })

    /**
     * It takes two strings as arguments, and sets them as the values of two localStorage keys
     * @param {string} access - The access token that is used to authenticate the user.
     * @param {string} refresh - The refresh token that was returned from the server.
     */
    function setTokens(access: string, refresh: string) {
        localStorage.setItem('JWT__access__token', access)
        localStorage.setItem('JWT__refresh__token', refresh)
    }

    /**
     * It removes the tokens from local storage.
     */
    function removeTokens() {
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
    }

    /**
     * It logs in a user.
     */
    async function logIn() {
        await userStore.logIn('/users/auth/login/', {
            username: user.value.username,
            password: user.value.password as string
        })
    }

    /**
     * It returns true if the user has the permission passed in as a parameter
     * @param {string} permission - The permission you want to check for.
     * @returns A boolean value.
     */
    function hasPerm(permission: string): boolean | undefined {
        return userStore.user?.permissions.includes(permission)
    }

    const newUser = reactive<UserRegister>({
        isCas: false,
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        phone: ''
    })
    watch(() => newUser.email, () => {
        if (!newUser.isCas) newUser.username = newUser.email
    })
    watch(() => userStore.newUser, () => {
        newUser.isCas = userStore.newUser?.isCas as boolean
        newUser.firstName = userStore.newUser?.firstName as string
        newUser.lastName = userStore.newUser?.lastName as string
        newUser.email = userStore.newUser?.email as string
        newUser.username = userStore.newUser?.username as string
        newUser.phone = userStore.newUser?.phone as string
    })

    const emailVerification = ref<string | undefined>('')


    async function userLocalRegister() {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/registration/', newUser)
    }

    async function userCASRegister(newUserInfo: string | null) {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.patch('/users/auth/user/', {phone: newUserInfo !== '' ? newUserInfo : null})
    }

    /**
     * It takes a list of associations and registers them for a user
     * @param {boolean} publicRequest - boolean - If the request is public or not
     * @param {string} username - the username of the user you want to associate with the associations
     * @param {AssociationUser[]} newUserAssociations - an array of objects with the following structure:
     */
    async function userAssociationsRegister(publicRequest: boolean, username: string, newUserAssociations: AssociationUser[]) {
        const idsAssociations = []
        const {axiosPublic, axiosAuthenticated} = useAxios()
        let instance = axiosAuthenticated as AxiosInstance
        if (publicRequest) instance = axiosPublic
        for (let i = 0; i < newUserAssociations.length; i++) {
            if (idsAssociations.indexOf(newUserAssociations[i].association) === -1)
                await instance.post('/users/associations/', {
                    user: username,
                    association: newUserAssociations[i].association,
                    isPresident: newUserAssociations[i].isPresident,
                    isSecretary: newUserAssociations[i].isSecretary,
                    isTreasurer: newUserAssociations[i].isTreasurer
                })
            idsAssociations.push(newUserAssociations[i].association)
        }
    }

    /**
     * It takes a boolean value as an argument, and if that value is true, it uses the public axios instance to make a post
     * request to the server, otherwise it uses the authenticated axios instance to make the same request
     * @param {boolean} publicRequest - boolean - if true, the request will be made to the public API, otherwise it will be
     * made to the authenticated API.
     */
    async function userGroupsRegister(publicRequest: boolean) {
        const groupsToRegister: UserGroupRegister[] = []
        const {newGroups} = useUserGroups()
        const {axiosPublic, axiosAuthenticated} = useAxios()
        let instance = axiosAuthenticated as AxiosInstance
        if (publicRequest) instance = axiosPublic
        if (newGroups.value.length) {
            newGroups.value.forEach(function (group) {
                groupsToRegister.push({
                    username: newUser.username,
                    group,
                    institution: null
                })
            })
            for (let i = 0; i < groupsToRegister.length; i++) {
                await instance.post('/users/groups/', groupsToRegister[i])
            }
        }
    }


    /**
     * `register` is an async function that calls `userCASRegister` if the user is CAS, otherwise it calls
     * `userLocalRegister`.
     *
     * If the user is CAS, it then calls `userAssociationsRegister` if `newAssociationsUser` is defined, and then calls
     * `userGroupsRegister`.
     *
     * If the user is not CAS, it then calls `userAssociationsRegister` if `newAssociationsUser.value` is defined, and then
     * calls `userGroupsRegister`.
     *
     * Finally, if the user is CAS, it clears `newUser` to avoid persistence of session.
     */
    async function register() {
        const {newAssociationsUser} = useAssociation()
        if (userStore.isCas) {
            await userCASRegister(newUser.phone)
            if (newAssociationsUser) {
                await userAssociationsRegister(true, newUser.username, newAssociationsUser.value)
            }
            await userGroupsRegister(true)
            // We must clear newUser to avoid persistence of session
            userStore.unLoadNewUser()
        } else {
            await userLocalRegister()
            if (newAssociationsUser.value) {
                await userAssociationsRegister(true, newUser.email, newAssociationsUser.value)
            }
            await userGroupsRegister(true)
        }
    }

    /**
     * It registers a new user as a manager, then registers the user's associations and groups
     */
    async function addUserAsManager() {
        const {newAssociationsUser} = useAssociation()
        await userLocalRegisterAsManager(newUser)
        if (newAssociationsUser.value) {
            await userAssociationsRegister(false, newUser.email, newAssociationsUser.value)
        }
        await userGroupsRegister(false)
    }

    async function loadCASUser() {
        const route = useRoute()
        // For aborted CAS registration or regular CAS registration
        if ((userStore.newUser && userStore.isCas) || route.query.ticket) {
            if (route.query.ticket) {
                await userStore.loadCASUser(route.query.ticket as string)
            }
            newUser.firstName = userStore.newUser?.firstName as string
            emailVerification.value = newUser.email
        }
    }

    async function userLocalRegisterAsManager(newUser: UserRegister) {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.post('/users/', newUser)
    }

    async function verifyEmail(key: string) {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/registration/verify-email/', {key: key})
    }

    async function resendEmail(email: string) {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/registration/resend-email/', {email})
    }

    async function passwordReset(email: string) {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/password/reset/', {email})
    }

    async function passwordResetConfirm(uid: string, token: string, newPassword1: string, newPassword2: string) {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/password/reset/confirm/', {uid, token, newPassword1, newPassword2})
    }

    return {
        logIn,
        user,
        register,
        newUser,
        loadCASUser,
        emailVerification,
        addUserAsManager,
        userCASRegister,
        setTokens,
        removeTokens,
        userLocalRegister,
        verifyEmail,
        resendEmail,
        passwordReset,
        passwordResetConfirm,
        userGroupsRegister,
        userLocalRegisterAsManager,
        hasPerm,
        userAssociationsRegister
    }
}
