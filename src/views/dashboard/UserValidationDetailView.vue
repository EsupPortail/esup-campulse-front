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
import useUserAssociations from '@/composables/useUserAssociations'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import useDocumentUploads from '@/composables/useDocumentUploads'
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'


const {t} = useI18n()
const {notify, loading} = useQuasar()
const {validateUser} = useUsers()
const {newGroups, groupChoiceIsValid, studentGroupIsSelected} = useUserGroups()
const {getUserAssociations} = useUserAssociations()
const {catchHTTPError} = useErrors()
const {uploadDocuments} = useDocumentUploads()

const userManagerStore = useUserManagerStore()
const route = useRoute()

onMounted(async () => {
    loading.show()
    await onGetUser()
    newGroups.value = userManagerStore.userGroups
    await onGetUserAssociations()
    loading.hide()
})

// Get user
async function onGetUser() {
    try {
        await userManagerStore.getUserDetail(parseInt(route.params.id as string))
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

// Get user associations
async function onGetUserAssociations() {
    try {
        await getUserAssociations(parseInt(route.params.id as string), true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

// Function that verify if the user is validated by the admin or not, and send the response to the back
async function onValidateUser() {
    if (groupChoiceIsValid.value) {
        try {
            await validateUser()
            await uploadDocuments(undefined, userManagerStore.user?.username, false)
            await router.push({name: 'ValidateUsers'})
            notify({
                type: 'positive',
                message: t('notifications.positive.validate-success')
            })
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
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
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}
</script>

<template>
    <div class="dashboard-section">
        <h2>
            <QIcon name="bi-person"/>
            {{ t('user.infos') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container">
                <div class="flex-column">
                    <div class="display-row">
                        <h3>{{ t('user.first-name') }}</h3>
                        <p>{{ userManagerStore.user?.firstName }}</p>
                    </div>
                    <div class="display-row">
                        <h3>{{ t('user.last-name') }}</h3>
                        <p>{{ userManagerStore.user?.lastName }}</p>
                    </div>
                    <div class="display-row">
                        <h3>{{ t('user.email') }}</h3>
                        <p>{{ userManagerStore.user?.email }}</p>
                    </div>
                    <div class="display-row">
                        <h3>{{ t('user.phone') }}</h3>
                        <p>{{ userManagerStore.user?.phone }}</p>
                    </div>
                    <div class="display-row">
                        <h3>{{ t('user.is-cas') }}</h3>
                        <p>{{ userManagerStore.user?.isCas ? t('yes') : t('no') }}</p>
                    </div>
                    <div class="display-row">
                        <h3>{{ t('user.is-validated-by-admin') }}</h3>
                        <p>{{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard-section">
        <h2>
            <QIcon name="bi-building"/>
            {{ t('directory.title') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container">
                <div v-if="userManagerStore.userAssociations.length">
                    <div class="flex-column">
                        <div
                            v-for="(association, index) in userManagerStore.userAssociations"
                            :key="index"
                            class="display-row"
                        >
                            <h3>{{ association.association.name }}</h3>
                            <ul>
                                <li>
                                    {{ t('dashboard.association-user.is-president') }}{{
                                        t('colon')
                                    }}{{ association.isPresident ? t('yes') : t('no') }}
                                </li>
                                <li>
                                    {{ t('dashboard.association-user.is-vice-president') }}{{
                                        t('colon')
                                    }}{{ association.isVicePresident ? t('yes') : t('no') }}
                                </li>
                                <li>
                                    {{ t('dashboard.association-user.is-secretary') }}{{
                                        t('colon')
                                    }}{{ association.isSecretary ? t('yes') : t('no') }}
                                </li>
                                <li>
                                    {{ t('dashboard.association-user.is-treasurer') }}{{
                                        t('colon')
                                    }}{{ association.isTreasurer ? t('yes') : t('no') }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <p class="no-data-label">{{ t('dashboard.association-user.not-association-member') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="dashboard-section">
        <h2>
            <QIcon name="bi-person-lines-fill"/>
            {{ t('user.groups') }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <FormUserGroups/>
                <div v-if="!userManagerStore.user?.isCas && studentGroupIsSelected">
                    <hgroup>
                        <h3>{{ t('forms.student-status-document') }}</h3>
                        <p>{{ t('forms.student-status-document-hint') }}</p>
                    </hgroup>
                    <FormDocumentUploads
                        :association-id="null"
                        process="user-management"
                    />
                </div>
            </div>
        </div>
    </div>

    <div class="flex-row-center padding-top padding-bottom">
        <QBtn
            :label="t('back')"
            :to="{ name: 'ValidateUsers' }"
            class="btn-lg"
            color="dashboard"
            icon="bi-chevron-compact-left"
        />
        <QBtn
            :label="t('user-manager.validate-account')"
            class="btn-lg"
            color="dashboard"
            icon="bi-check-lg"
            @click="onValidateUser"
        />
        <QBtn
            :label="t('user-manager.delete-account-application')"
            class="btn-lg"
            color="custom-red"
            icon="bi-file-earmark-x"
            @click="onDeleteUser"
        />
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import "@/assets/_variables.scss";
</style>
