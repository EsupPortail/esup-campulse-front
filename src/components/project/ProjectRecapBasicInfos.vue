<script lang="ts" setup>
import useSubmitProject from '@/composables/useSubmitProject'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {onMounted, ref} from 'vue'
import useErrors from '@/composables/useErrors'
import ProjectRecapCategories from '@/components/project/ProjectRecapCategories.vue'
import {useAssociationStore} from '@/stores/useAssociationStore'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import useCharters from '@/composables/useCharters'
import {useUserManagerStore} from '@/stores/useUserManagerStore'

const {
    projectBasicInfos,
    projectId,
    projectProcessingDate,
    initProjectAssociationUsersLabels,
    projectAssociationUsersLabels
} = useSubmitProject()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()
const {initAssociationCharterStatus} = useCharters()

const applicant = ref<'association' | 'user'>(projectBasicInfos.value.association ? 'association' : 'user')

onMounted(async () => {
    loading.show()
    await onGetAssociationUsers()
    await onGetAssociationDetails()
    await onGetUser()
    loading.hide()
})

async function onGetAssociationUsers() {
    try {
        if (projectBasicInfos.value.associationUser && applicant.value === 'association') {
            await initProjectAssociationUsersLabels(projectBasicInfos.value.association as number)
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}

async function onGetAssociationDetails() {
    if (applicant.value === 'association') {
        try {
            await associationStore.getAssociationDetail(projectBasicInfos.value.association as number, false)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
    }
}

async function onGetUser() {
    if (applicant.value === 'user') {
        try {
            await userManagerStore.getUserDetail(projectBasicInfos.value.user as number)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
    }
}
</script>

<template>
    <div class="flex-column">
        <div class="display-row">
            <h4
                :data-test="t('project.applicant')"
                class="row-title"
            >
                {{ t('project.applicant') }}
            </h4>
            <p>
                {{
                    applicant === 'association' ? `${associationStore.association?.acronym}
                (${associationStore.association?.name})` :
                    `${userManagerStore.user?.firstName} ${userManagerStore.user?.lastName}`
                }}
            </p>
        </div>

        <div
            v-if="applicant === 'association'"
            class="display-row"
        >
            <h4
                :data-test="t('charter.status.title')"
                class="row-title"
            >
                {{ t('charter.status.title') }}
            </h4>
            <CharterStatusIndicator
                :charter-status="initAssociationCharterStatus(associationStore.association?.charterStatus, associationStore.association?.isSite ?? false)"
            />
        </div>

        <div
            v-if="projectId"
            class="display-row"
        >
            <h4
                :data-test="t('project.id')"
                class="row-title"
            >
                {{ t('project.id') }}
            </h4>
            <p>{{ projectId }}</p>
        </div>

        <div
            v-if="projectProcessingDate"
            class="display-row"
        >
            <h4
                :data-test="t('project.processing-date')"
                class="row-title"
            >
                {{ t('project.processing-date') }}
            </h4>
            <p>{{ projectProcessingDate }}</p>
        </div>

        <div class="display-row">
            <h4
                :data-test="t('project.name')"
                class="row-title"
            >
                {{ t('project.name') }}
            </h4>
            <p>{{ projectBasicInfos.name }}</p>
        </div>

        <div class="display-row">
            <h4
                :data-test="t('project.planned-start-date')"
                class="row-title"
            >
                {{ t('project.planned-start-date') }}
            </h4>
            <p>
                {{
                    projectBasicInfos.plannedStartDate.split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <h4
                :data-test="t('project.planned-end-date')"
                class="row-title"
            >
                {{ t('project.planned-end-date') }}
            </h4>
            <p>{{ projectBasicInfos.plannedEndDate.split('-').reverse().join('/') }}</p>
        </div>

        <div class="display-row">
            <h4
                :data-test="t('project.planned-location')"
                class="row-title"
            >
                {{ t('project.planned-location') }}
            </h4>
            <p>{{ projectBasicInfos.plannedLocation }}</p>
        </div>

        <div
            v-if="projectBasicInfos.associationUser"
            class="display-row"
        >
            <h4
                :data-test="t('project.association-user')"
                class="row-title"
            >
                {{ t('project.association-user') }}
            </h4>
            <p>{{ projectAssociationUsersLabels.find(x => x.value === projectBasicInfos.associationUser)?.label }}</p>
        </div>

        <div
            v-if="projectBasicInfos.partnerAssociation"
            class="display-row"
        >
            <h4
                :data-test="t('project.partner-association')"
                class="row-title"
            >
                {{ t('project.partner-association') }}
            </h4>
            <p>{{ projectBasicInfos.partnerAssociation }}</p>
        </div>

        <ProjectRecapCategories/>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
