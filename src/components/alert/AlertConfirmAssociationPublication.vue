<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const associationStore = useAssociationStore()
const {notify} = useQuasar()

const emit = defineEmits(['hasValidated'])

const confirmation = ref<boolean>(false)

async function onPublishAssociation() {
    let positiveMessage = t('notifications.positive.unpublish-association')
    let negativeMessage = t('notifications.negative.unpublish-association-error')
    if (!associationStore.association?.isPublic) {
        positiveMessage = t('notifications.positive.publish-association')
        negativeMessage = t('notifications.negative.publish-association-error')
    }
    try {
        await associationStore.patchPublicAssociation(!associationStore.association?.isPublic, associationStore.association?.id)
        emit('hasValidated')
        notify({
            type: 'positive',
            message: positiveMessage
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: negativeMessage
        })
    }
}

</script>

<template>
    <QBtn
        :color="!associationStore.association?.isPublic ? 'association' : 'custom-red'"
        :icon="!associationStore.association?.isPublic ? 'bi-eye' : 'bi-eye-slash'"
        :label="!associationStore.association?.isPublic ? t('association.publish-in-directory') : t('association.unpublish-in-directory')"
        class="btn-lg"
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
                        !associationStore.association?.isPublic ? t('alerts.confirm-association-publish') : t('alerts.confirm-association-unpublish')
                    }}
                </p>
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
                        :color="!associationStore.association?.isPublic ? 'association' : 'custom-red'"
                        :icon="!associationStore.association?.isPublic ? 'bi-eye' : 'bi-eye-slash'"
                        :label="!associationStore.association?.isPublic ? t('association.publish-in-directory') : t('association.unpublish-in-directory')"
                        class="btn-lg"
                        @click="onPublishAssociation"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
</style>
