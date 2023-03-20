<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import router from '@/router'
import useUserAssociations from "@/composables/useUserAssociations";
import type {AssociationUserDetail} from "#/user";

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {validateUser} = useUsers()
const {getUserAssociations, initRole, associationRoleOptions} = useUserAssociations()

const userManagerStore = useUserManagerStore()
const route = useRoute()

onMounted(async () => {
    loading.show
    await onGetUserAssociations()
    loading.hide
})

const associationUser = ref<AssociationUserDetail>()
watch(() => userManagerStore.userAssociations.length, () => {
    associationUser.value = userManagerStore.userAssociations.find(obj => obj.association.id === parseInt(route.params.associationId as string))
})

// Get user associations
async function onGetUserAssociations() {
    try {
        await getUserAssociations(parseInt(route.params.userId as string), true)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

// Function that verify if the user is validated by the admin or not, and send the response to the back
async function onValidateUser() {
    try {
        await validateUser()
        await router.push({name: 'ValidateUsers'})
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

async function onDeleteUser() {
    try {
        await userManagerStore.deleteUser()
        await router.push({name: 'ValidateUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete-user')
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.unknown-user')
        })
    }
}
</script>

<template>
    <section class="dashboard-section">
        <h2>
            <QIcon name="bi-person"/>
            {{ t('user.infos') }}
        </h2>

        <div class="form-container">
            <div class="form">

                <div class="rows-container">
                    <div class="display-row">
                        <h3 class="row-title">{{ t('user.first-name') }}</h3>
                        <p>{{ associationUser?.user.firstName }}</p>
                    </div>
                    <div class="display-row">
                        <h3 class="row-title">{{ t('user.last-name') }}</h3>
                        <p>{{ associationUser?.user.lastName }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <QIcon name="bi-person-lines-fill"/>
            {{ t('directory.title') }}
        </h2>

        <div class="form-container">
            <div class="form">
                <div class="rows-container">
                    <div class="display-row">
                        <h3 class="row-title">{{ associationUser?.association.name }}</h3>
                        <p v-if="associationUser">
                            {{ associationRoleOptions.find(obj => obj.value === initRole(associationUser)).label }}</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="form-page-navigation">
        <QBtn :label="t('back')" :to="{ name: 'ValidateUsers' }" color="secondary" icon="bi-chevron-compact-left"/>
        <QBtn :label="t('user-manager.delete-account-application')" color="red" icon="bi-file-earmark-x"
              @click="onDeleteUser"/>
        <QBtn :label="t('user-manager.validate-account')" color="primary" icon-right="bi-check2"
              @click="onValidateUser"/>
    </section>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
@import '@/assets/styles/dashboard.scss'
@import '@/assets/styles/user-validation-detail.scss'
</style>