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
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()

const associationStore = useAssociationStore()

const emit = defineEmits(['userAssociationDeleted'])

const props = defineProps<{
    editedByStaff: boolean
    associationId: number,
    userId: number,
}>()

async function onDeleteUserAssociation() {
    loading.show()
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
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

</script>

<template>
    <QBtn
        :aria-label="props.editedByStaff ? t('dashboard.association-user.delete-association') : t('dashboard.association-user.delete-association-self')"
        class="btn-lg"
        color="custom-red"
        icon="bi-trash"
        outline
        @click="confirmation = true"
    />

    <QDialog
        v-model="confirmation"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <p class="q-ml-sm">
                    {{
                        props.editedByStaff ? t('dashboard.association-user.confirm-delete') :
                        t('dashboard.association-user.confirm-delete-self')
                    }}
                </p>
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
                        :label="props.editedByStaff ? t('dashboard.association-user.delete-association') : t('dashboard.association-user.delete-association-self')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-trash"
                        @click="onDeleteUserAssociation"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>
