import {reactive, ref, watch} from 'vue'
import type {
    AssociationRole,
    CASUser,
    LocalLogin,
    UserAssociationRegister,
    UserGroupRegister,
    UserRegister
} from '#/user'
import useUserGroups from '@/composables/useUserGroups'
import {useUserStore} from '@/stores/useUserStore'
import {useAxios} from '@/composables/useAxios'
import {useRoute} from 'vue-router'
import useUserAssociations from '@/composables/useUserAssociations'
import useCommissions from '@/composables/useCommissions'
import zxcvbn from 'zxcvbn'
import type {SelectLabel} from '#/index'

// Used for local login
const user = ref<LocalLogin>({
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

    function setTokens(access: string, refresh: string) {
        localStorage.setItem('JWT__access__token', access)
        localStorage.setItem('JWT__refresh__token', refresh)
    }

    function removeTokens() {
        localStorage.removeItem('JWT__access__token')
        localStorage.removeItem('JWT__refresh__token')
    }

    async function logIn() {
        await userStore.logIn('/users/auth/login/', {
            username: user.value.username,
            password: user.value.password as string
        })
    }

    const tokenExpired = (token: string): boolean => {
        if (!token) return true
        return JSON.parse(window.atob(token.split('.')[1])).exp < Math.trunc(Date.now() / 1000)
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

    function hasPerm(permission: string): boolean | undefined {
        return userStore.user?.permissions.includes(permission)
    }

    const initNewUserData = () => {
        newUser.isCas = userStore.newUser?.isCas ?? false as boolean
        newUser.firstName = userStore.newUser?.firstName as string
        newUser.lastName = userStore.newUser?.lastName as string
        newUser.email = userStore.newUser?.email as string
        emailVerification.value = userStore.newUser?.email
        newUser.username = userStore.newUser?.username as string
        newUser.phone = userStore.newUser?.phone as string
    }

    watch(() => userStore.newUser, initNewUserData)

    async function userLocalRegister() {
        const {newAssociations} = useUserAssociations()
        const {userFunds} = useCommissions()

        const gifus: UserGroupRegister[] = groupsToRegister(null)
        const associations = associationsToRegister(newAssociations.value, null)

        const user = {
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phone: newUser.phone,
            gifus,
            associations
        }

        await axiosPublic.post('/users/auth/registration/', user)
        userFunds.value = []
    }

    async function userCASRegister() {
        const {newAssociations} = useUserAssociations()
        const {userFunds} = useCommissions()

        const gifus: UserGroupRegister[] = groupsToRegister(null)
        const associations = associationsToRegister(newAssociations.value, null)

        const user = {
            phone: newUser.phone,
            gifus,
            associations
        }

        await axiosAuthenticated.patch('/users/auth/registration/cas/', user)
        userFunds.value = []
    }

    const associationsToRegister = (associations: AssociationRole[], user: number | null): UserAssociationRegister[] => {
        const factory: UserAssociationRegister[] = associations.map(association => ({
            association: association.id,
            isPresident: association.role === 'isPresident',
            isSecretary: association.role === 'isSecretary',
            isTreasurer: association.role === 'isTreasurer',
            isVicePresident: association.role === 'isVicePresident'
        }))
        if (user) factory.forEach(association => association.user = user)
        return factory
    }

    async function userAssociationsRegister(user: number | null) {
        if (!user) return
        const idsAssociations = []
        const {newAssociations} = useUserAssociations()
        for (const association of newAssociations.value) {
            const isNew = !idsAssociations.includes(association.id)
            if (isNew)
                await axiosAuthenticated.post('/users/associations/', associationsToRegister([association], user)[0])
            idsAssociations.push(association.id)
        }
    }

    const groupsToRegister = (user: number | null): UserGroupRegister[] => {
        const {newGroups, commissionGroup} = useUserGroups()
        const {userFunds} = useCommissions()

        const nonCommissionGroups: UserGroupRegister[] = newGroups.value
            .filter(group => group !== commissionGroup.value?.id)
            .map(group => ({
                group,
                institution: null,
                fund: null
            }))
        const commissionGroups: UserGroupRegister[] = userFunds.value
            .map(fund => ({
                group: commissionGroup.value?.id,
                institution: null,
                fund
            }))

        const groups = [...nonCommissionGroups, ...commissionGroups]
        if (user) groups.forEach(group => group.user = user)
        return groups
    }

    async function register() {
        if (userStore.isCas) {
            await userCASRegister()
        } else {
            await userLocalRegister()
        }
    }

    async function addUserAsManager() {
        const {newAssociations} = useUserAssociations()

        const gifus: UserGroupRegister[] = groupsToRegister(null)
        const associations = associationsToRegister(newAssociations.value, null)

        const user = {
            isCas: newUser.isCas,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phone: newUser.phone,
            gifus,
            associations
        }

        await axiosAuthenticated.post('/users/', user)
    }

    const CASUsers = ref<CASUser[]>([])

    async function getUsersFromCAS(lastName: string) {
        const url = `/users/external/?last_name=${lastName}`
        CASUsers.value = (await axiosAuthenticated.get<CASUser[]>(url)).data
    }

    const CASUserOptions = ref<SelectLabel[]>([])

    const initCASUserOptions = () => {
        CASUserOptions.value = CASUsers.value.map(user => ({
            value: user.username,
            label: `${user.firstName} ${user.lastName} (${user.mail})`
        }))
    }
    watch(() => CASUsers.value.length, initCASUserOptions)

    async function loadCASUser() {
        const route = useRoute()
        // For aborted CAS registration or regular CAS registration
        if ((userStore.newUser && userStore.isCas) || route.query.ticket) {
            await userStore.loadCASUser(route.query.ticket as string)
        }
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
        hasPerm,
        userAssociationsRegister,
        initNewUserData,
        getUsersFromCAS,
        CASUsers,
        CASUserOptions,
        checkPasswordStrength,
        initCASUserOptions,
        cancelAbortedCasRegistration,
        CAS_INSTITUTION_DOMAIN,
        tokenExpired
    }
}
