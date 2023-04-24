<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useQuasar} from 'quasar'
import axios from 'axios'
import router from '@/router'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const confirm = ref<boolean>(false)
const userManagerStore = useUserManagerStore()
const {notify} = useQuasar()
const {catchHTTPError} = useErrors()

const emit = defineEmits(['hasValidated'])

async function onDeleteUser() {
    try {
        await userManagerStore.deleteUser()
        emit('hasValidated')
        await router.push({name: 'ManageUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete-user')
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
        :label="t('user-manager.delete-user')"
        color="delete"
        icon="mdi-delete"
        @click="confirm = true"
    />

    <QDialog
        v-model="confirm"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("user-manager.confirm-delete") }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('cancel')"
                    color="secondary"
                    icon="mdi-arrow-left-circle"
                />
                <QBtn
                    v-close-popup
                    :label="t('user-manager.delete-user')"
                    color="delete"
                    icon="mdi-delete"
                    @click="onDeleteUser"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
