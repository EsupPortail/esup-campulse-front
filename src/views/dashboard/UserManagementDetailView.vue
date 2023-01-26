<script lang="ts" setup>
import FormManagedUserUpdate from '@/components/form/FormManagedUserUpdate.vue'
import {useI18n} from 'vue-i18n'


const {t} = useI18n()

/*import {onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import type {ManagedUser, UserAssociationDetail} from '#/user'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useQuasar} from 'quasar'
import useUserGroups from '@/composables/useUserGroups'
import useUsers from '@/composables/useUsers'

const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const route = useRoute()
const {newGroups} = useUserGroups()
const {getUser} = useUsers()

// Watch function observes and updates only if data had been changed
const user = ref<ManagedUser | undefined>(userManagerStore.user)
watch(() => userManagerStore.user, () => {
    user.value = userManagerStore.user
})

const userAssociations = ref<UserAssociationDetail[]>(userManagerStore.userAssociations)
watch(() => userManagerStore.userAssociations, () => {
    userAssociations.value = userManagerStore.userAssociations
})

// Boolean select options
const booleanSelectOptions = [
    {
        label: t('yes'),
        value: true
    },
    {
        label: t('no'),
        value: false
    }
]

onMounted(async () => {
    loading.show
    await onGetUser()
    //newGroups.value = userManagerStore.userGroups
    //await onGetUserAssociations()
    loading.hide
})

// Load user
async function onGetUser() {
    try {
        await getUser(route.params.id as string)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

// Load userAssociations
async function onGetUserAssociations() {
    try {
        await userManagerStore.getUserAssociations(parseInt(route.params.id as string))
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}*/

// Function that verify if the user is validated by the admin or not, and send the response to the back
/*
async function onValidateUser() {
async function onValidateChanges() {
    if (groupChoiceIsValid.value) {
        try {
            await updateUserInfos(user.value as ManagedUser, userAssociations.value)
            await router.push({name: 'ManageUsers'})
            notify({
                type: 'positive',
                message: t('notifications.positive.validate-success')
            })
        } catch (e) {
            notify({
                type: 'negative',
                message: t('notifications.negative.unknown-user')
            })
        }
    }
}
*/

</script>

<template>
    <h1>{{ t('user-manager.manage-account') }}</h1>
    <FormManagedUserUpdate/>
</template>