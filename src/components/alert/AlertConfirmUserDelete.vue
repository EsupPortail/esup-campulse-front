<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useQuasar} from 'quasar'
import axios from 'axios'
import router from '@/router'

const {t} = useI18n()
const confirm = ref<boolean>(false)
const userManagerStore = useUserManagerStore()
const {notify} = useQuasar()

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
    } catch (e) {
        if (axios.isAxiosError(e) || e === 403) {
            notify({
                type: 'negative',
                message: t('notifications.negative.cannot-delete-superuser')
            })
        } else {
            notify({
                type: 'negative',
                message: t('notifications.negative.unknown-user')
            })
        }
    }
}
</script>

<template>
    <QBtn
        :label="t('user-manager.delete-user')"
        color="red"
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
                    color="red"
                    icon="mdi-delete"
                    @click="onDeleteUser"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
