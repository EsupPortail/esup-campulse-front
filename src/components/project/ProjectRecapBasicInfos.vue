<script lang="ts" setup>
import useSubmitProject from '@/composables/useSubmitProject'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import useErrors from '@/composables/useErrors'

const {projectBasicInfos, initProjectAssociationUsersLabels, projectAssociationUsersLabels} = useSubmitProject()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()


onMounted(async () => {
    loading.show()
    await onGetAssociationUsers()
    loading.hide()
})

async function onGetAssociationUsers() {
    try {
        if (projectBasicInfos.value.associationUser && projectBasicInfos.value.association) {
            await initProjectAssociationUsersLabels(projectBasicInfos.value.association)
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
    <section class="flex-section">
        <div class="display-row">
            <p class="row-title">{{ t('project.name') }}</p>
            <p>{{ projectBasicInfos.name }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-start-date') }}</p>
            <p>
                {{
                    projectBasicInfos.plannedStartDate.split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-end-date') }}</p>
            <p>{{ projectBasicInfos.plannedEndDate.split('-').reverse().join('/') }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-location') }}</p>
            <p>{{ projectBasicInfos.plannedLocation }}</p>
        </div>

        <div
            v-if="projectBasicInfos.associationUser"
            class="display-row"
        >
            <p class="row-title">{{ t('project.association-user') }}</p>
            <p>{{ projectAssociationUsersLabels.find(x => x.value === projectBasicInfos.associationUser)?.label }}</p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.display-row {
    width: 100% !important;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}
</style>