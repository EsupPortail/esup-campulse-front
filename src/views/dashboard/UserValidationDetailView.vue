<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import router from '@/router'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import useUserGroups from '@/composables/useUserGroups'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {validateUser} = useUsers()
const {newGroups, groupChoiceIsValid} = useUserGroups()

const userManagerStore = useUserManagerStore()
const route = useRoute()

onMounted(async () => {
    loading.show
    await onGetUser()
    newGroups.value = userManagerStore.userGroups
    await onGetUserAssociations()
    loading.hide
})

// Get user
async function onGetUser() {
    try {
        await userManagerStore.getUserDetail(parseInt(route.params.id as string))
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

// Get user associations
async function onGetUserAssociations() {
    try {
        await userManagerStore.getUserAssociations(userManagerStore.user?.id as number)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

// Function that verify if the user is validated by the admin or not, and send the response to the back
async function onValidateUser() {
    if (groupChoiceIsValid.value) {
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
                    <article class="display-row">
                        <h3 class="row-title">{{ t('user.first-name') }}</h3>
                        <p>{{ userManagerStore.user?.firstName }}</p>
                    </article>
                    <article class="display-row">
                        <h3 class="row-title">{{ t('user.last-name') }}</h3>
                        <p>{{ userManagerStore.user?.lastName }}</p>
                    </article>
                    <article class="display-row">
                        <h3 class="row-title">{{ t('user.email') }}</h3>
                        <p>{{ userManagerStore.user?.email }}</p>
                    </article>
                    <article class="display-row">
                        <h3 class="row-title">{{ t('user.phone') }}</h3>
                        <p>{{ userManagerStore.user?.phone }}</p>
                    </article>
                    <article class="display-row">
                        <h3 class="row-title">{{ t('user.is-cas') }}</h3>
                        <p>{{ userManagerStore.user?.isCas ? t('yes') : t('no') }}</p>
                    </article>
                    <article class="display-row">
                        <h3 class="row-title">{{ t('user.is-validated-by-admin') }}</h3>
                        <p>{{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}</p>
                    </article>
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

                <div v-if="userManagerStore.userAssociations.length">

                    <div class="rows-container">
                        <article class="display-row" v-for="(association, index) in userManagerStore.userAssociations" :key="index">
                            <h3 class="row-title">{{ association.association.name }}</h3>
                            <ul>
                                <li>{{ t('dashboard.association-user.is-president') }} :
                                    {{ association.isPresident ? t('yes') : t('no') }}
                                </li>
                                <li>{{ t('dashboard.association-user.can-be-president') }} :
                                    {{ association.canBePresident ? t('yes') : t('no') }}
                                </li>
                                <li>{{ t('dashboard.association-user.is-secretary') }} :
                                    {{ association.isSecretary ? t('yes') : t('no') }}
                                </li>
                                <li>{{ t('dashboard.association-user.is-treasurer') }} :
                                    {{ association.isTreasurer ? t('yes') : t('no') }}
                                </li>
                            </ul>
                        </article>
                    </div>

                </div>
                <div v-else>
                    <p class="no-data-label">{{ t('dashboard.association-user.not-association-member') }}</p>
                </div>

            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <QIcon name="bi-person-lines-fill"/>
            {{ t('user.groups') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <FormUserGroups/>
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