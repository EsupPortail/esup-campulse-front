<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useRoute} from 'vue-router'
import FormAssociationEdition from '@/components/form/FormAssociationEdition.vue'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import useUtility from '@/composables/useUtility'
import {useUserStore} from '@/stores/useUserStore'
import router from '@/router'
import useUserGroups from '@/composables/useUserGroups'

const {notify, loading} = useQuasar()

const route = useRoute()
const associationStore = useAssociationStore()
const {catchHTTPError} = useErrors()
const {dynamicTitle} = useUtility()
const userStore = useUserStore()
const {isStaff} = useUserGroups()

const isLoaded = ref(false)

// Check if user has president status
const isAuthorized = () => {
    if (isStaff) return true
    else return userStore.hasPresidentStatus(parseInt(route.params.id as string))
}

// Get all infos on mounted
async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), false)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetInstitutions() {
    try {
        await associationStore.getInstitutions()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetInstitutionComponents() {
    try {
        await associationStore.getInstitutionComponents()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

async function onGetAssociationActivityFields() {
    try {
        await associationStore.getActivityFields()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

onMounted(async function () {
    loading.show()
    if (isAuthorized()) {
        await onGetAssociationDetail()
        dynamicTitle.value = associationStore.association?.name
        await onGetInstitutions()
        await onGetInstitutionComponents()
        await onGetAssociationActivityFields()
        isLoaded.value = true
    } else {
        await router.push({name: '404'})
    }
    loading.hide()
})
</script>

<template>
    <FormAssociationEdition v-if="isLoaded" />
</template>
