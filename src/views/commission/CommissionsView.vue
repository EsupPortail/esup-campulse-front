<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import useUserGroups from '@/composables/useUserGroups'
import DashboardStudentProjectsManagement from '@/components/dashboard/DashboardStudentProjectsManagement.vue'
import DashboardProjectsManagement from '@/components/dashboard/DashboardProjectsManagement.vue'

const {t} = useI18n()
const projectStore = useProjectStore()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {isStaff} = useUserGroups()

onMounted(async () => {
    loading.show()
    await onGetProjects()
    loading.hide()
})

async function onGetProjects() {
    try {
        await projectStore.getAllProjects()
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
    <DashboardProjectsManagement v-if="isStaff"/>
    <DashboardStudentProjectsManagement v-else/>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';

p.paragraph {
    text-align: center;
}
</style>
