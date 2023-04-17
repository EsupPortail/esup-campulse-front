<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useRoute} from 'vue-router'
import FormAssociationEdition from '@/components/form/FormAssociationEdition.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()

const route = useRoute()
const associationStore = useAssociationStore()

const isLoaded = ref(false)

// Get all infos on mounted
async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), false)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetInstitutions() {
    try {
        await associationStore.getInstitutions()
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetInstitutionComponents() {
    try {
        await associationStore.getInstitutionComponents()
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetAssociationActivityFields() {
    try {
        await associationStore.getActivityFields()
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

onMounted(async function () {
    loading.show()
    await onGetAssociationDetail()
    await onGetInstitutions()
    await onGetInstitutionComponents()
    await onGetAssociationActivityFields()
    isLoaded.value = true
    loading.hide()
})
</script>

<template>
    <FormAssociationEdition v-if="isLoaded"/>
</template>
