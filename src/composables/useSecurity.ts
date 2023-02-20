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
    // Tested
    function setTokens(access: string, refresh: string) {
        localStorage.setItem('JWT__access__token', access)
        localStorage.setItem('JWT__refresh__token', refresh)
    }

    /**
     * It removes the tokens from local storage.
     */
    // Tested
    function removeTokens() {
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
    }

    /**
     * It logs in a user.
     */
    // Tested
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
    // TODO retest
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

    const emailVerification = ref<string | undefined>('')


    async function userLocalRegister() {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/registration/', newUser)
    }

    // Tested
    async function userCASRegister(newUserInfo: string | null) {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.patch('/users/auth/user/', {phone: newUserInfo !== '' ? newUserInfo : null})
    }

    // ???
    async function userAssociationsRegister(publicRequest: boolean, username: string, newUserAssociations: AssociationUser[]) {
        const idsAssociations = []
        const {axiosPublic, axiosAuthenticated} = useAxios()
        let instance = axiosAuthenticated as AxiosInstance
        if (publicRequest) instance = axiosPublic
        for (let i = 0; i < newUserAssociations.length; i++) {
            if (idsAssociations.indexOf(newUserAssociations[i].id) === -1)
                await instance.post('/users/associations/', {
                    user: username,
                    association: newUserAssociations[i].id,
                    isPresident: newUserAssociations[i].isPresident,
                    isSecretary: newUserAssociations[i].isSecretary,
                    isTreasurer: newUserAssociations[i].isTreasurer
                })
            idsAssociations.push(newUserAssociations[i].id)
        }
    }


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

    //
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
    // To test
    async function addUserAsManager() {
        const {newAssociationsUser} = useAssociation()
        await userLocalRegisterAsManager(newUser)
        if (newAssociationsUser.value) {
            await userAssociationsRegister(false, newUser.email, newAssociationsUser.value)
        }
        await userGroupsRegister(false)
    }

    //
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

    // Tested
    async function userLocalRegisterAsManager(newUser: UserRegister) {
        const {axiosAuthenticated} = useAxios()
        await axiosAuthenticated.post('/users/', newUser)
    }

    // Tested
    async function verifyEmail(key: string) {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/registration/verify-email/', {key: key})
    }

    // Tested
    async function resendEmail(email: string) {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/registration/resend-email/', {email})
    }

    // Tested
    async function passwordReset(email: string) {
        const {axiosPublic} = useAxios()
        await axiosPublic.post('/users/auth/password/reset/', {email})
    }

    // Tested
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
        hasPerm
    }
}
