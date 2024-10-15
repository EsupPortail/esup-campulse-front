import {reactive, ref, watch} from 'vue'
import type {CasLogin, CASUser, LocalLogin, User, UserGroupRegister, UserRegister} from '#/user'
import useUserGroups from '@/composables/useUserGroups'
import {useUserStore} from '@/stores/useUserStore'
import {useAxios} from '@/composables/useAxios'
import {useRoute} from 'vue-router'
import type {AxiosInstance} from 'axios'
import useUserAssociations from '@/composables/useUserAssociations'
import useCommissions from '@/composables/useCommissions'
import zxcvbn from 'zxcvbn'

// Used for local login
const userCredentials = ref<LocalLogin>({
    username: '',
    password: ''
})

const emailVerification = ref<string | undefined>('')

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

// Used in register form to avoid users with emails linked to the CAS institution to local register
const CAS_INSTITUTION_DOMAIN = import.meta.env.VITE_APP_CAS_INSTITUTION_DOMAIN as string

export default function () {
    const userStore = useUserStore()
    const {axiosAuthenticated, axiosPublic} = useAxios()

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
     * Logs in a user by posting the provided data, determining the login type based on casLogin flag.
     * @param {boolean} casLogin - Flag indicating whether the login is a CAS login (true) or a local login (false).
     * @param {LocalLogin | CasLogin} data - User login data, either as LocalLogin or CasLogin.
     * @throws {Error} If the user is not validated by an admin or if the user account is incomplete.
     * @returns {Promise<void>} - Sets the user state and tokens if login is successful.
     */
    async function logIn(casLogin: boolean, data: LocalLogin | CasLogin) {
        const {axiosPublic} = useAxios()

        try {
            const url = casLogin ? '/users/auth/cas/login/' : '/users/auth/login/'
            const response = await axiosPublic.post(url, data)
            const {access, refresh, user} = response.data as { access: string, refresh: string, user: User }
            // User account is complete
            if (user.groups.length) {
                if (user.isValidatedByAdmin) {
                    setTokens(access, refresh)
                    userStore.user = user
                } else {
                    throw new Error('USER_NOT_VALIDATED_BY_ADMIN')
                }
            }
            // User account is not complete
            else {
                setTokens(access, refresh)
                newUser.isCas = user.isCas
                newUser.email = user.email
                newUser.username = user.username
                newUser.firstName = user.firstName
                newUser.lastName = user.lastName
                newUser.phone = user.phone
                throw new Error('USER_ACCOUNT_NOT_COMPLETE')
            }
        } catch (error) {
            console.error('Login failed: ', error)
            throw error
        }
    }

    async function cancelAbortedCasRegistration() {
        // Delete user in DB
        await axiosAuthenticated.delete('/users/auth/user/')
        // Clean newUser data
        newUser.isCas = false
        newUser.firstName = ''
        newUser.lastName = ''
        newUser.email = ''
        newUser.username = ''
        newUser.phone = ''
        // Clean userStore
        userStore.newUser = undefined
        // Clean local storage
        removeTokens()
    }

    /**
     * It returns true if the user has the permission passed in as a parameter
     * @param {string} permission - The permission you want to check for.
     * @returns A boolean value.
     */
    function hasPerm(permission: string): boolean | undefined {
        return userStore.user?.permissions.includes(permission)
    }

    const initNewUserData = () => {
        newUser.isCas = userStore.newUser?.isCas as boolean
        newUser.firstName = userStore.newUser?.firstName as string
        newUser.lastName = userStore.newUser?.lastName as string
        newUser.email = userStore.newUser?.email as string
        emailVerification.value = userStore.newUser?.email
        newUser.username = userStore.newUser?.username as string
        newUser.phone = userStore.newUser?.phone as string
    }

    watch(() => userStore.newUser, initNewUserData)

    async function userLocalRegister() {
        await axiosPublic.post('/users/auth/registration/', newUser)
    }

    async function userCASRegister(newUserInfo: string | null) {
        await axiosAuthenticated.patch('/users/auth/user/', {phone: newUserInfo})
    }

    /**
     * It takes a list of associations and registers them for a user
     * @param {boolean} publicRequest - boolean - If the request is public or not
     * @param {string} username - the username of the user you want to associate with the associations
     */
    async function userAssociationsRegister(publicRequest: boolean, username: string | undefined) {
        const idsAssociations = []
        const {newAssociations} = useUserAssociations()
        let instance = axiosAuthenticated as AxiosInstance
        if (publicRequest) instance = axiosPublic
        for (let i = 0; i < newAssociations.value.length; i++) {
            if (idsAssociations.indexOf(newAssociations.value[i].id) === -1)
                await instance.post('/users/associations/', {
                    user: username,
                    association: newAssociations.value[i].id,
                    isPresident: newAssociations.value[i].role === 'isPresident',
                    isSecretary: newAssociations.value[i].role === 'isSecretary',
                    isTreasurer: newAssociations.value[i].role === 'isTreasurer',
                    isVicePresident: newAssociations.value[i].role === 'isVicePresident'
                })
            idsAssociations.push(newAssociations.value[i].id)
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
        const {newGroups, commissionGroup} = useUserGroups()
        const {userFunds} = useCommissions()
        let instance = axiosAuthenticated as AxiosInstance
        if (publicRequest) instance = axiosPublic
        if (newGroups.value.length) {
            newGroups.value.forEach(function (group) {
                // Register commission groups
                if (group === commissionGroup.value?.id) {
                    userFunds.value.forEach(function (fund) {
                        groupsToRegister.push({
                            user: newUser.username,
                            group,
                            institution: null,
                            fund
                        })
                    })
                }
                // Register other groups
                else {
                    groupsToRegister.push({
                        user: newUser.username,
                        group,
                        institution: null,
                        fund: null
                    })
                }
            })
            for (let i = 0; i < groupsToRegister.length; i++) {
                await instance.post('/users/groups/', groupsToRegister[i])
            }
            userFunds.value = []
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
     */
    async function register() {
        const {newAssociationsUser} = useUserAssociations()
        if (userStore.isCas) {
            await userCASRegister(newUser.phone)
            await userGroupsRegister(true)
            if (newAssociationsUser) {
                await userAssociationsRegister(true, newUser.username)
            }
        } else {
            await userLocalRegister()
            await userGroupsRegister(true)
            if (newAssociationsUser.value) {
                await userAssociationsRegister(true, newUser.email)
            }
        }
    }

    /**
     * It registers a new user as a manager, then registers the user's associations and groups
     */
    async function addUserAsManager() {
        const {newAssociationsUser} = useUserAssociations()
        await userLocalRegisterAsManager(newUser)
        await userGroupsRegister(false)
        if (newAssociationsUser.value) {
            let username = newUser.email
            if (newUser.isCas) username = newUser.username
            await userAssociationsRegister(false, username)
        }
    }

    const CASUsers = ref<CASUser[]>([])

    async function getUsersFromCAS(lastName: string) {
        CASUsers.value = []
        CASUsers.value = (await axiosAuthenticated.get<CASUser[]>(`/users/external/?last_name=${lastName}`)).data
    }

    const CASUserOptions = ref<{ value: string, label: string }[]>([])

    const initCASUserOptions = () => {
        CASUserOptions.value = CASUsers.value.map(user => ({
            value: user.username,
            label: user.firstName + ' ' + user.lastName + ' (' + user.mail + ')'
        }))
    }
    watch(() => CASUsers.value.length, initCASUserOptions)

    async function loadCASUser() {
        const route = useRoute()
        // For aborted CAS registration or regular CAS registration
        if ((userStore.newUser && userStore.isCas) || route.query.ticket) {
            if (route.query.ticket) {
                await userStore.loadCASUser(route.query.ticket as string)
            }
        }
    }

    async function userLocalRegisterAsManager(newUser: UserRegister) {
        await axiosAuthenticated.post('/users/', newUser)
    }

    async function verifyEmail(key: string) {
        await axiosPublic.post('/users/auth/registration/verify-email/', {key: key})
    }

    async function resendEmail(email: string) {
        await axiosPublic.post('/users/auth/registration/resend-email/', {email})
    }

    async function passwordReset(email: string) {
        await axiosPublic.post('/users/auth/password/reset/', {email})
    }

    async function passwordResetConfirm(uid: string, token: string, newPassword1: string, newPassword2: string) {
        await axiosPublic.post('/users/auth/password/reset/confirm/', {uid, token, newPassword1, newPassword2})
    }

    function checkPasswordStrength(password: string) {
        const passwordChecker = {
            valid: true,
            score: zxcvbn(password).score,
        }
        if (passwordChecker.score < 4) passwordChecker.valid = false
        return passwordChecker
    }

    return {
        userCredentials,
        logIn,
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
        userAssociationsRegister,
        initNewUserData,
        getUsersFromCAS,
        CASUsers,
        CASUserOptions,
        checkPasswordStrength,
        initCASUserOptions,
        cancelAbortedCasRegistration,
        CAS_INSTITUTION_DOMAIN
    }
}
