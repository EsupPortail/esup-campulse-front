<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const associationStore = useAssociationStore()
const {notify} = useQuasar()

const confirmation = ref<boolean>(false)

async function onPublishAssociation() {
    const messageKeyword = !associationStore.association?.isPublic ? 'publish' : 'unpublish'
    try {
        await associationStore.patchPublicAssociation(!associationStore.association?.isPublic, associationStore.association?.id)
        notify({
            type: 'positive',
            message: t(`notifications.positive.${messageKeyword}-association`)
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: t(`notifications.negative.${messageKeyword}-association-error`)
        })
    }
}

</script>

<template>
    <QBtn
        :color="!associationStore.association?.isPublic ? 'green' : 'orange'"
        :icon="!associationStore.association?.isPublic ? 'mdi-notebook-check' : 'mdi-notebook-remove'"
        :label="!associationStore.association?.isPublic ? t('association.publish-in-directory') : t('association.unpublish-in-directory')"
        @click="confirmation = true"
    />

    <QDialog
        v-model="confirmation"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{
                    !associationStore.association?.isPublic ? t('alerts.confirm-association-publish') : t('alerts.confirm-association-unpublish')
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
                    :color="!associationStore.association?.isPublic ? 'green' : 'orange'"
                    :icon="!associationStore.association?.isPublic ? 'mdi-notebook-check' : 'mdi-notebook-remove'"
                    :label="!associationStore.association?.isPublic ? t('association.publish-in-directory') : t('association.unpublish-in-directory')"
                    @click="onPublishAssociation"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
