<script lang="ts" setup>
import FormProfilePasswordEdit from '@/components/form/FormProfilePasswordEdit.vue'
import {useI18n} from 'vue-i18n'
import FormUserInfosEdition from '@/components/form/FormUserInfosEdition.vue'
import {useUserStore} from '@/stores/useUserStore'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'
import axios from 'axios'
import useUsers from '@/composables/useUsers'
import {useQuasar} from 'quasar'
import useUserAssociations from '@/composables/useUserAssociations'
import FormDisplayUserAssociations from '@/components/form/FormDisplayUserAssociations.vue'
import FormRegisterUserAssociations from '@/components/form/FormRegisterUserAssociations.vue'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()
const userStore = useUserStore()
const {isStaff} = useUserGroups()
const {initInfosToPatch, infosToPatch, updateUserInfos} = useUsers()
const {notify, loading} = useQuasar()
const {userAssociationsRegister} = useSecurity()
const {
    newAssociations,
    updateUserAssociations,
    getUserAssociations,
    initUserAssociations,
    userAssociations
} = useUserAssociations()

const tab = ref<string>('infos')

async function onUpdateUserInfos() {
    loading.show
    try {
        initInfosToPatch(userStore.user)
        if (Object.entries(infosToPatch).length !== 0) {
            await updateUserInfos(userStore.user, false)
            notify({
                type: 'positive',
                message: t('notifications.positive.update-user-infos')
            })
        } else {
            notify({
                type: 'warning',
                message: t('notifications.warning.no-modifications-found')
            })
        }
    } catch (error) {
        if (axios.isAxiosError(error) || error === 500) {
            notify({
                type: 'negative',
                message: t('notifications.negative.email-used')
            })
        }
    }
    loading.hide
}

async function onUpdateUserAssociations() {
    loading.show
    try {
        await updateUserAssociations(false)
        await userAssociationsRegister(false, userStore.user?.username)
        newAssociations.value = []
        await getUserAssociations(userStore.user?.id, false)
        initUserAssociations(false)
        await
        notify({
            type: 'positive',
            message: t('notifications.positive.associations-successfully-updated')
        })
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.edit-user-associations-error')
        })
    }
    loading.hide
}

</script>

<template>
    <QTabs
        v-model="tab"
        active-color="primary"
        dense
        indicator-color="primary"
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
        <QTabPanel name="infos">
            <section class="association-cards dashboard-section">
                <div class="form-title">
                    <h2>
                        <i
                            aria-hidden="true"
                            class="bi bi-pencil-square"
                        ></i>
                        {{ t('dashboard.my-infos') }}
                    </h2>
                </div>

                <div class="form-container">
                    <div class="form">
                        <QForm
                            class="q-gutter-md"
                            @submit.prevent="onUpdateUserInfos"
                        >
                            <FormUserInfosEdition
                                :edited-by-staff="false"
                                :user="userStore.user"
                            />
                            <QBtn
                                :label="t('validate-changes')"
                                type="submit"
                            />
                        </QForm>
                    </div>
                </div>
            </section>
        </QTabPanel>

        <QTabPanel name="associations">
            <section class="association-cards dashboard-section">
                <div class="form-title">
                    <h2>
                        <i
                            aria-hidden="true"
                            class="bi bi-pencil-square"
                        ></i>
                        {{ t('dashboard.association-user.my-associations') }}
                    </h2>
                </div>

                <div class="form-container">
                    <div class="form">
                        <FormDisplayUserAssociations/>
                    </div>
                </div>
            </section>

            <section
                v-if="userAssociations.length < 5"
                class="association-cards dashboard-section"
            >
                <div class="form-title">
                    <h2>
                        <i
                            aria-hidden="true"
                            class="bi bi-pencil-square"
                        ></i>
                        {{ t('dashboard.association-user.new-associations') }}
                    </h2>
                </div>

                <div class="form-container">
                    <div class="form">
                        <QForm
                            @submit.prevent="onUpdateUserAssociations"
                        >
                            <FormRegisterUserAssociations/>
                            <section class="form-page-navigation">
                                <QBtn
                                    :label="t('back')"
                                    :to="{ name: 'Dashboard' }"
                                    icon="bi-chevron-compact-left"
                                />
                                <QBtn
                                    v-if="newAssociations.length > 0 && newAssociations[0].id"
                                    :label="t('validate')"
                                    class="validate-button"
                                    icon-right="bi-check2"
                                    type="submit"
                                />
                            </section>
                        </QForm>
                    </div>
                </div>
            </section>
        </QTabPanel>

        <QTabPanel name="password">
            <FormProfilePasswordEdit/>
        </QTabPanel>
    </QTabPanels>
</template>

<style lang="sass" scoped>
.validate-button
    margin-top: 2rem
</style>
