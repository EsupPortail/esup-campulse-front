<script lang="ts" setup>
import FormProfilePasswordEdit from '@/components/form/FormProfilePasswordEdit.vue'
import {useI18n} from 'vue-i18n'
import FormUserInfosEdition from '@/components/form/FormUserInfosEdition.vue'
import {useUserStore} from '@/stores/useUserStore'
import {onMounted, ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import axios from 'axios'
import useUsers from '@/composables/useUsers'
import {useQuasar} from 'quasar'
import useUserAssociations from '@/composables/useUserAssociations'
import FormDisplayUserAssociations from '@/components/form/FormDisplayUserAssociations.vue'
import FormRegisterUserAssociations from '@/components/form/FormRegisterUserAssociations.vue'
import useSecurity from '@/composables/useSecurity'
import useErrors from '@/composables/useErrors'
import FormDocumentUploads from '@/components/form/FormDocumentUploads.vue'
import useDocumentUploads from '@/composables/useDocumentUploads'

const {t} = useI18n()
const userStore = useUserStore()
const {isStaff, initGroupPermToJoinAssociation} = useUserGroups()
const {initInfosToPatch, infosToPatch, updateUserInfos} = useUsers()
const {notify, loading} = useQuasar()
const {userAssociationsRegister, hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()
const {
    newAssociations,
    updateUserAssociations,
    getUserAssociations,
    initUserAssociations,
    userAssociations
} = useUserAssociations()
const {uploadDocuments, initProcessDocuments, initUserDocumentUploads} = useDocumentUploads()

const tab = ref<string>('infos')

async function onUpdateUserInfos() {
    loading.show()
    try {
        initInfosToPatch(userStore.user)
        if (Object.entries(infosToPatch).length) {
            await updateUserInfos(userStore.user, false)
            notify({
                type: 'positive',
                message: t('notifications.positive.update-user-infos')
            })
        } /*else {
            notify({
                type: 'warning',
                message: t('notifications.warning.no-modifications-found')
            })
        }*/
        await uploadDocuments(undefined, userStore.user?.username, false)
        initProcessDocuments()
        await userStore.getUserDocuments()
        initUserDocumentUploads()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
    loading.hide()
}

async function onUpdateUserAssociations() {
    loading.show()
    try {
        await updateUserAssociations(false)
        await userAssociationsRegister(false, userStore.user?.username)
        newAssociations.value = []
        await getUserAssociations(userStore.user?.id, false)
        initUserAssociations(false)
        notify({
            type: 'positive',
            message: t('notifications.positive.associations-successfully-updated')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
    loading.hide()
}

onMounted(() => {
    const groupArray = userStore.user?.groups.map(group => group.groupId)
    if (groupArray && groupArray.length) initGroupPermToJoinAssociation(groupArray)
})

</script>

<template>
    <QTabs
        v-model="tab"
        active-color="dashboard"
        class="padding-top"
        dense
        indicator-color="dashboard"
        narrow-indicator
    >
        <QTab
            :label="t('dashboard.my-infos')"
            name="infos"
        />
        <QTab
            v-if="!isStaff"
            :label="t('dashboard.my-associations')"
            name="associations"
        />
        <QTab
            v-if="!userStore.user?.isCas"
            :label="t('dashboard.my-password')"
            name="password"
        />
    </QTabs>

    <QTabPanels
        v-model="tab"
        animated
    >
        <QTabPanel
            name="infos"
        >
            <div class="dashboard-section">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-pencil-square"
                    ></i>
                    {{ t('dashboard.my-infos') }}
                </h2>

                <div class="dashboard-section-container">
                    <div class="container">
                        <QForm
                            class="q-gutter-md"
                            @submit.prevent="onUpdateUserInfos"
                        >
                            <FormUserInfosEdition
                                v-if="userStore.user"
                                :edited-by-staff="false"
                                :user="userStore.user"
                            />
                            <div v-if="!isStaff && (hasPerm('add_project_user') || hasPerm('add_project_association'))">
                                <hgroup>
                                    <h3>{{ t('forms.student-status-document') }}</h3>
                                    <p>{{ t('forms.student-status-document-hint') }}</p>
                                </hgroup>
                                <FormDocumentUploads
                                    :association-id="undefined"
                                    process="account-management"
                                />
                            </div>
                            <div class="flex-row-center">
                                <QBtn
                                    :label="t('validate-changes')"
                                    class="btn-lg"
                                    color="dashboard"
                                    icon="bi-check-lg"
                                    type="submit"
                                />
                            </div>
                        </QForm>
                    </div>
                </div>
            </div>
        </QTabPanel>

        <QTabPanel
            name="associations"
        >
            <div class="dashboard-section">
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-pencil-square"
                    ></i>
                    {{ t('dashboard.association-user.my-associations') }}
                </h2>

                <div class="dashboard-section-container">
                    <div class="container flex-column">
                        <FormDisplayUserAssociations/>
                    </div>
                </div>
            </div>

            <section
                v-if="userAssociations.length < 5"
                class="dashboard-section"
            >
                <h2>
                    <i
                        aria-hidden="true"
                        class="bi bi-pencil-square"
                    ></i>
                    {{ t('dashboard.association-user.new-associations') }}
                </h2>

                <div class="dashboard-section-container">
                    <div class="container">
                        <QForm
                            @submit.prevent="onUpdateUserAssociations"
                        >
                            <FormRegisterUserAssociations/>
                            <div class="flex-row-center padding-top">
                                <QBtn
                                    :label="t('back')"
                                    :to="{ name: 'Dashboard' }"
                                    class="btn-lg"
                                    color="dashboard"
                                    icon="bi-chevron-compact-left"
                                />
                            </div>
                        </QForm>
                    </div>
                </div>
            </section>
        </QTabPanel>

        <QTabPanel
            name="password"
        >
            <FormProfilePasswordEdit/>
        </QTabPanel>
    </QTabPanels>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';
@import '@/assets/styles/dashboard.scss';
</style>
