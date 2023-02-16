<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useDirectory from '@/composables/useDirectory'
import {useRoute} from 'vue-router'
import FormAssociationEdition from '@/components/form/FormAssociationEdition.vue'

const {t} = useI18n()
const {notify} = useQuasar()
const {loading} = useQuasar()
const {getAssociationDetail} = useDirectory()

const route = useRoute()
const associationStore = useAssociationStore()

const isLoaded = ref(false)

// Get all infos on mounted
async function onGetAssociationDetail() {
    try {
        await getAssociationDetail(route.params.id as string)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetAssociationInstitutions() {
    try {
        await associationStore.getInstitutions()
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetAssociationComponents() {
    try {
        await associationStore.getComponents()
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetAssociationFields() {
    try {
        await associationStore.getFields()
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

onMounted(async function () {
    loading.show
    await onGetAssociationDetail()
    await onGetAssociationInstitutions()
    await onGetAssociationComponents()
    await onGetAssociationFields()
    isLoaded.value = true
    loading.hide
})
</script>

<template>
    <h1>{{ associationStore.association?.name }}</h1>
    <FormAssociationEdition
        v-if="isLoaded"/>
</template>
