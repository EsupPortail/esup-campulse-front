<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {ref} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {getUsersFromCAS, CASUsers, CASUserOptions, newUser, emailVerification} = useSecurity()
const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

const lastName = ref<string>('')

const open = ref<boolean>(false)

const displayResetButton = ref<boolean>(false)

const selectedUser = ref<string>('')

async function onGetUsersFromCAS() {
    if (lastName.value) {
        try {
            loading.show()
            await getUsersFromCAS(lastName.value)
            loading.hide()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
}

function onImportUser() {
    const extendedCASUser = CASUsers.value.find(obj => obj.username === selectedUser.value)
    if (selectedUser.value && extendedCASUser) {
        loading.show()
        newUser.isCas = true
        newUser.username = extendedCASUser.username
        newUser.firstName = extendedCASUser.firstName
        newUser.lastName = extendedCASUser.lastName
        newUser.email = extendedCASUser.mail
        emailVerification.value = extendedCASUser.mail
        open.value = false
        CASUsers.value = []
        displayResetButton.value = true
        lastName.value = ''
        loading.hide()
        notify({
            type: 'positive',
            message: t('notifications.positive.get-cas-user-success')
        })
    }
}

function onReset() {
    loading.show()
    open.value = false
    selectedUser.value = ''
    newUser.isCas = false
    newUser.username = ''
    newUser.firstName = ''
    newUser.lastName = ''
    newUser.email = ''
    emailVerification.value = ''
    CASUsers.value = []
    displayResetButton.value = false
    lastName.value = ''
    loading.hide()
}
</script>

<template>
    <div class="flex-row-center">
        <QBtn
            :label="t('dashboard.search-user-via-cas')"
            class="btn-lg"
            color="dashboard"
            icon="bi-person-plus"
            @click="open = true"
        />
        <QBtn
            v-if="displayResetButton"
            :label="t('cancel')"
            class="btn-lg"
            color="dashboard"
            icon="bi-x-lg"
            @click="onReset"
        />
    </div>
    <QDialog
        v-model="open"
        class="variant-space-4"
    >
        <QCard>
            <QCardSection>
                <QForm
                    v-if="CASUsers.length === 0"
                    class="q-gutter-md"
                    @submit.prevent="onGetUsersFromCAS"
                >
                    <h3>{{ t('dashboard.search-user-via-cas') }}</h3>
                    <QInput
                        v-model="lastName"
                        :label="t('forms.last-name')"
                        :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                        color="dashboard"
                        filled
                        lazy-rules
                    />
                    <div class="flex-row">
                        <QBtn
                            :label="t('cancel')"
                            class="btn-lg"
                            color="dashboard"
                            icon="bi-x-lg"
                            @click="onReset"
                        />
                        <QBtn
                            :label="t('search')"
                            class="btn-lg"
                            color="dashboard"
                            icon="bi-search"
                            type="submit"
                        />
                    </div>
                </QForm>
                <QForm
                    v-else
                    class="q-gutter-md"
                    @submit.prevent="onImportUser"
                >
                    <h3>{{ t('user-manager.users-found') }}</h3>
                    <p>{{ t('user-manager.choose-user-to-add') }}</p>
                    <QOptionGroup
                        v-model="selectedUser"
                        :options="CASUserOptions"
                        aria-label="t('forms.user-to-add')"
                        color="dashboard"
                        emit-value
                        map-options
                    />
                    <div class="flex-row padding-top">
                        <QBtn
                            :label="t('cancel')"
                            class="btn-lg"
                            color="dashboard"
                            icon="bi-x-lg"
                            @click="onReset"
                        />
                        <QBtn
                            :disable="!selectedUser"
                            :label="t('add')"
                            class="btn-lg"
                            color="dashboard"
                            icon="bi-person-plus"
                            type="submit"
                        />
                    </div>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
</style>
