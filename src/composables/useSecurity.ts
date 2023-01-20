import { ref } from 'vue'
import { useRoute } from 'vue-router'

import type { UserLogin, UserRegister } from '#/user'
import useAssociation from '@/composables/useAssociation'
import useUserGroups from '@/composables/useUserGroups'
import * as userService from '@/services/userService'
import { useUserStore } from '@/stores/useUserStore'

export default function() {

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
        const { newAssociations } = useAssociation()
        const { newGroups } = useUserGroups()
        if (userStore.isCas) {
            await userService.userCASRegister(newUser.value.phone)
            if (newAssociations) {
                await userService.userAssociationsRegister(newUser.value.username, newAssociations.value)
            }
            await userService.userGroupsRegister(newUser.value.username, newGroups.value)
            // We must clear newUser to avoid persistence of session
            await userStore.unLoadNewUser()
        } else {
            await userService.userLocalRegister(newUser.value)
            if (newAssociations.value) {
                await userService.userAssociationsRegister(newUser.value.email, newAssociations.value)
            }
            await userService.userGroupsRegister(newUser.value.email, newGroups.value)
        }
    }

    async function addUserAsManager() {
        const { newAssociations } = useAssociation()
        const { newGroups } = useUserGroups()
        await userService.userLocalRegisterAsManager(newUser.value)
        if (newAssociations.value) {
            await userService.userAssociationsRegister(newUser.value.email, newAssociations.value)
        }
        await userService.userGroupsRegister(newUser.value.email, newGroups.value)
    }

    // to test
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

    return { logIn, user, register, newUser, loadCASUser, emailVerification, addUserAsManager }
}
