<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserManagerStore } from '@/stores/useUserManagerStore'
import { useQuasar } from 'quasar'

const props = defineProps({
    associationId: Number
})

const { t } = useI18n()
const confirm = ref<boolean>(false)
const userManagerStore = useUserManagerStore()
const { notify } = useQuasar()

async function onDeleteAssociation() {
    try {
        await userManagerStore.deleteUserAssociation(props.associationId as number)
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete-user-association')
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.request-error')
        })
    }
}
</script>

<template>
    <QBtn :label="t('dashboard.association-user.delete-association')" color="red" icon="mdi-delete"
        @click="confirm = true" />

    <QDialog v-model="confirm" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t("user-manager.user-association-confirm-delete") }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn v-close-popup :label="t('cancel')" color="secondary" icon="mdi-arrow-left-circle" />
                <QBtn v-close-popup :label="t('dashboard.association-user.delete-association')" color="red"
                    icon="mdi-delete" @click="onDeleteAssociation" />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
