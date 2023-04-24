<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import useUserAssociation from '@/composables/useUserAssociations'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {t} = useI18n()
const confirmation = ref<boolean>(false)
const {deleteUserAssociation} = useUserAssociation()
const {notify} = useQuasar()
const {catchHTTPError} = useErrors()

const associationStore = useAssociationStore()

const emit = defineEmits(['userAssociationDeleted'])

const props = defineProps<{
    editedByStaff: boolean
    associationId: number,
    userId: number,
}>()

async function onDeleteUserAssociation() {
    try {
        await deleteUserAssociation(props.userId, props.associationId)
        emit('userAssociationDeleted')
        await associationStore.getAssociationNames(false, true)
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete-user-association')
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
        :label="props.editedByStaff ? t('dashboard.association-user.delete-association') : t('dashboard.association-user.delete-association-self')"
        color="delete"
        icon="mdi-delete"
        @click="confirmation = true"
    />

    <QDialog
        v-model="confirmation"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <span
                    class="q-ml-sm"
                >{{
                    props.editedByStaff ? t("dashboard.association-user.confirm-delete") : t("dashboard.association-user.confirm-delete-self")
                }}</span>
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
                    :label="props.editedByStaff ? t('dashboard.association-user.delete-association') : t('dashboard.association-user.delete-association-self')"
                    color="delete"
                    icon="mdi-delete"
                    @click="onDeleteUserAssociation"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
