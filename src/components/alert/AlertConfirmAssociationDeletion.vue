<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import router from '@/router'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {t} = useI18n()
const confirmation = ref<boolean>(false)
const deletionWord = ref<string>('')
const associationStore = useAssociationStore()
const {notify} = useQuasar()
const {catchHTTPError} = useErrors()

async function onDeleteAssociation() {
    try {
        if (deletionWord.value === t('association.before-deletion-word')) {
            await associationStore.deleteAssociation(associationStore.association?.id)
            await router.push({name: 'ManageAssociations'})
            notify({
                type: 'positive',
                message: t('notifications.positive.delete-association')
            })
        } else {
            notify({
                type: 'negative',
                message: t('association.before-deletion-word-error')
            })
        }
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
        :label="t('association.delete-association')"
        class="btn-lg"
        color="custom-red"
        icon="bi-trash"
        @click="confirmation = true"
    />

    <QDialog
        v-model="confirmation"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <p class="q-ml-sm">{{ t('association.confirm-delete') }}</p>
            </QCardSection>
            <QCardSection>
                <QInput
                    v-model=deletionWord
                    :label="t('association.before-deletion-word-instruction')"
                    class="padding-bottom"
                    color="association"
                    @paste.prevent
                />
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
                        :label="t('association.delete-association')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-trash"
                        @click="onDeleteAssociation"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
</style>
