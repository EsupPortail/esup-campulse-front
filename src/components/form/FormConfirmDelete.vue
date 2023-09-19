<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import router from '@/router'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {t} = useI18n()
const confirm = ref<boolean>(false)
const userManagerStore = useUserManagerStore()
const {notify} = useQuasar()
const {catchHTTPError} = useErrors()

async function onDeleteUser() {
    try {
        await userManagerStore.deleteUser()
        await router.push({name: 'ManageUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete-user')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}
</script>

<template>
    <QBtn
        :label="t('user-manager.delete')"
        color="custom-red"
        icon="bi-trash"
        @click="confirm = true"
    />

    <QDialog
        v-model="confirm"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t('user-manager.confirm-delete') }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    color="red"
                    flat
                    label="t('cancel')"
                />
                <QBtn
                    v-close-popup
                    color="delete"
                    flat
                    label="t('delete')"
                    @click="onDeleteUser"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
