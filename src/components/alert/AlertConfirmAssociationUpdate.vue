<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from "axios";
import useAssociation from "@/composables/useAssociation";
import router from '@/router'

const {t} = useI18n()
const confirmation = ref<boolean>(false)
const {notify} = useQuasar()
const {updateAssociation} = useAssociation()

const emit = defineEmits(['hasValidated'])

async function onValidateChanges() {
    try {
        await updateAssociation()
        emit('hasValidated')
        await router.push({name: 'ManageAssociations'})
        notify({
            message: t('notifications.positive.association-successfully-updated'),
            type: 'positive'
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            notify({
                message: t('notifications.negative.edit-association-error'),
                type: 'negative'
            })
        }
    }
}
</script>

<template>
    <QBtn
        :label="t('association.validate-all-changes')"
        color="primary"
        icon="mdi-check-circle"
        @click="confirmation = true"
    />

    <QDialog v-model="confirmation" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t('association.alert-confirm-changes') }}</span>
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
                    :label="t('association.validate-all-changes')"
                    color="primary"
                    icon="mdi-check-circle"
                    @click="onValidateChanges"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
