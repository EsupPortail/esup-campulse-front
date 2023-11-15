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

async function onSiteAssociation() {
    let positiveMessage = t('notifications.positive.unsite-association')
    let negativeMessage = t('notifications.negative.unsite-association-error')
    if (!associationStore.association?.isSite) {
        positiveMessage = t('notifications.positive.site-association')
        negativeMessage = t('notifications.negative.site-association-error')
    }
    try {
        await associationStore.patchSiteAssociation(!associationStore.association?.isSite, associationStore.association?.id)
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
        :color="!associationStore.association?.isSite ? 'association' : 'custom-red'"
        :icon="!associationStore.association?.isSite ? 'bi-eye' : 'bi-eye-slash'"
        :label="!associationStore.association?.isSite ? t('association.site-in-directory') : t('association.unsite-in-directory')"
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
                        !associationStore.association?.isPublic ? t('alerts.confirm-association-site') : t('alerts.confirm-association-unsite')
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
                        :color="!associationStore.association?.isSite ? 'association' : 'custom-red'"
                        :icon="!associationStore.association?.isSite ? 'bi-eye' : 'bi-eye-slash'"
                        :label="!associationStore.association?.isSite ? t('association.site-in-directory') : t('association.unsite-in-directory')"
                        class="btn-lg"
                        @click="onSiteAssociation"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
</style>
