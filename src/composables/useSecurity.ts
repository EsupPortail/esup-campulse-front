import {ref} from 'vue'
import type {UserLogin, UserRegister} from '#/user'
import {useUserStore} from '@/stores/useUserStore'
import {userAssociationsRegister, userCASRegister, userGroupsRegister, userLocalRegister} from '@/services/userService'
import {useRoute} from 'vue-router'
import useAssociation from "@/composables/useAssociation";
import useUserGroups from "@/composables/useUserGroups";

export default function () {

    const user = ref<UserLogin>({
        username: '',
        password: ''
    })

    const userStore = useUserStore()

    async function logIn() {
        await userStore.logIn('/users/auth/login/', {
            username: user.value.username,
            password: user.value.password as string
        })
    }

    const newUser = ref<UserRegister>({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    })

    const emailVerification = ref<string | undefined>('')

    async function register() {
        const {newAssociations} = useAssociation()
        const {newGroups} = useUserGroups()
        if (userStore.isCas) {
            if (newUser.value.phone) {
                await userCASRegister(newUser.value.phone)
            }
            if (newAssociations) {
                await userAssociationsRegister(newUser.value.username, newAssociations.value)
            }
            await userGroupsRegister(newUser.value.username, newGroups.value)
            // We must clear newUser to avoid persistence of session
            await userStore.unLoadNewUser()
        } else {
            await userLocalRegister(newUser.value)
            if (newAssociations.value) {
                await userAssociationsRegister(newUser.value.email, newAssociations.value)
            }
            await userGroupsRegister(newUser.value.email, newGroups.value)
        }
    }

    async function loadCASUser() {
        const route = useRoute()
        // For aborted CAS registration or regular CAS registration
        if ((userStore.newUser && userStore.isCas) || route.query.ticket) {
            if (route.query.ticket) {
                await userStore.loadCASUser(route.query.ticket as string)
            }
            newUser.value = userStore.newUser
            emailVerification.value = newUser.value.email
        }
    }

    return {logIn, user, register, newUser, loadCASUser, emailVerification}
}