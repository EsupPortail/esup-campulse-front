<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUsers from '@/composables/useUsers'
import useUserGroups from '@/composables/useUserGroups'
import useUserAssociations from '@/composables/useUserAssociations'
import useSecurity from '@/composables/useSecurity'
import useErrors from '@/composables/useErrors'


const {t} = useI18n()
const {notify} = useQuasar()
const userManagerStore = useUserManagerStore()
const {updateUserInfos, initInfosToPatch, infosToPatch} = useUsers()
const {updateUserGroups} = useUserGroups()
const {updateUserAssociations, userAssociations} = useUserAssociations()
const {userAssociationsRegister} = useSecurity()
const {catchHTTPError} = useErrors()


const emit = defineEmits(['hasValidated'])

const confirmation = ref<boolean>(false)


async function onValidateChanges() {
    try {
        initInfosToPatch(userManagerStore.user)
        if (Object.entries(infosToPatch).length) {
            await updateUserInfos(userManagerStore.user, true)
        }
        await updateUserAssociations(true)
        if (userAssociations.value.length) {
            await userAssociationsRegister(false, userManagerStore.user?.username)
        }
        await updateUserGroups()
        emit('hasValidated')
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-success')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <QBtn
            :label="t('dashboard.validate-changes')"
            class="btn-lg"
            color="dashboard"
            icon="bi-check-lg"
            @click="confirmation = true"
    />

    <QDialog
            v-model="confirmation"
            persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <p>{{ t('user-manager.alert-confirm-update') }}</p>
                <div class="flex-row padding-top">
                    <QBtn
                            v-close-popup
                            :label="t('cancel')"
                            class="btn-lg"
                            color="dashboard"
                            icon="bi-x-lg"
                    />
                    <QBtn
                            v-close-popup
                            :label="t('dashboard.validate-changes')"
                            class="btn-lg"
                            color="dashboard"
                            icon="bi-check-lg"
                            @click="onValidateChanges"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
