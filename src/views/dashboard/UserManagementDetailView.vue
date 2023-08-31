<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import AlertConfirmUserDelete from '@/components/alert/AlertConfirmUserDelete.vue'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import useUserGroups from '@/composables/useUserGroups'
import router from '@/router'
import AlertLeaveEdition from '@/components/alert/AlertLeaveEdition.vue'
import AlertConfirmUserUpdate from '@/components/alert/AlertConfirmUserUpdate.vue'
import FormUserInfosEdition from '@/components/form/FormUserInfosEdition.vue'
import FormUpdateUserAssociations from '@/components/form/FormUpdateUserAssociations.vue'
import FormRegisterUserAssociations from '@/components/form/FormRegisterUserAssociations.vue'
import {useUserStore} from '@/stores/useUserStore'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'


const {t} = useI18n()
const {notify, loading} = useQuasar()
const {groupChoiceIsValid, groupCanJoinAssociation, studentGroupIsSelected} = useUserGroups()
const {catchHTTPError} = useErrors()


const userManagerStore = useUserManagerStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(async () => {
    loading.show()
    await onGetUser()
    loading.hide()
})

// Load user
async function onGetUser() {
    try {
        await userManagerStore.getUserDetail(parseInt(route.params.id as string))
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
}

// Open alert if user leaves
const openAlert = ref<boolean>(false)
const leaveEdition = ref<boolean>(false)
const hasValidated = ref<boolean>(false)

function onLeaveEdition() {
    leaveEdition.value = true
    router.push({name: 'ManageUsers'})
}

// Check is there are any changes before leaving the page
onBeforeRouteLeave((to, from, next) => {
    // We open pop-up if manager has nos validated changes and manager is auth (to prevent pop-up to open on logout)
    if (!hasValidated.value && userStore.isAuth) {
        openAlert.value = true
        if (!leaveEdition.value) {
            next(false)
        } else {
            next(true)
        }
    } else {
        next(true)
    }
})
</script>

<template>
    <QForm
        v-if="userManagerStore.user"
        class="dashboard-section"
        @submit.prevent="openAlert = true"
    >
        <section>
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-pencil-square"
                ></i>
                {{ t('user-manager.user-infos') }}
            </h2>

            <div class="dashboard-section-container">
                <div class="container">
                    <FormUserInfosEdition
                        :edited-by-staff="true"
                        :user="userManagerStore.user"
                    />
                </div>
            </div>
        </section>

        <section
            v-if="groupCanJoinAssociation"
            class="association-cards dashboard-section"
        >
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-pencil-square"
                ></i>
                {{ t('user-manager.user-associations') }}
            </h2>

            <div class="dashboard-section-container">
                <div class="container flex-column">
                    <FormUpdateUserAssociations/>
                    <FormRegisterUserAssociations/>
                </div>
            </div>
        </section>

        <section class="dashboard-section">
            <h2>
                <QIcon name="bi-person-lines-fill"/>
                {{ t('user-manager.user-status') }}
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
                    <ul>
                        <li>
                            <strong>{{ t('user.is-cas') }}</strong>{{
                                t('colon')
                            }}{{ userManagerStore.user?.isCas ? t('yes') : t('no') }}
                        </li>
                        <li>
                            <strong>{{ t('user.is-validated-by-admin') }}</strong>
                            {{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}
                        </li>
                    </ul>
                </div>
            </div>

            <div class="flex-row-center padding-top padding-bottom">
                <QBtn
                    :label="t('back')"
                    class="btn-lg"
                    color="dashboard"
                    icon="bi-box-arrow-left"
                    @click="openAlert = true"
                />
                <AlertLeaveEdition
                    :open-alert="openAlert"
                    :text="t('alerts.leave-user-edition')"
                    @closeAlert="openAlert = !openAlert"
                    @leaveEdition="onLeaveEdition"
                />
                <AlertConfirmUserUpdate
                    v-if="groupChoiceIsValid"
                    @has-validated="hasValidated = true"
                />
                <AlertConfirmUserDelete @has-validated="hasValidated = true"/>
            </div>
        </section>
    </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';

</style>
