<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useAssociation from '@/composables/useAssociation'
//import useUserGroups from '@/composables/useUserGroups'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const confirmation = ref<boolean>(false)
const {notify} = useQuasar()
const {updateAssociation} = useAssociation()
//const {isStaff} = useUserGroups()
const {catchHTTPError} = useErrors()
const {loading} = useQuasar()

//const associationStore = useAssociationStore()

//const associationId = ref<number | undefined>(associationStore.association?.id)

const emit = defineEmits(['hasValidated'])

async function onValidateChanges() {
    loading.show()
    try {
        await updateAssociation()
        emit('hasValidated')
        notify({
            type: 'positive',
            message: t('notifications.positive.association-successfully-updated')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <QBtn
        :label="t('association.validate-all-changes')"
        class="btn-lg"
        color="association"
        icon="bi-check-lg"
        @click="confirmation = true"
    />

    <QDialog
        v-model="confirmation"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <p class="q-ml-sm">{{ t('association.alert-confirm-changes') }}</p>
                <div class="flex-row padding-top">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="association"
                        icon="bi-x-lg"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('association.validate-all-changes')"
                        class="btn-lg"
                        color="association"
                        icon="bi-check-lg"
                        @click="onValidateChanges"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
</style>
