<script lang="ts" setup>
import useSubmitProject from '@/composables/useSubmitProject'
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
import ProjectRecapCategories from '@/components/project/ProjectRecapCategories.vue'
import {useAssociationStore} from '@/stores/useAssociationStore'
import CharterStatusIndicator from '@/components/charter/CharterStatusIndicator.vue'
import useCharters from '@/composables/useCharters'
import {useProjectStore} from '@/stores/useProjectStore'

const {
    projectBasicInfos,
    projectId,
    projectProcessingDate,
} = useSubmitProject()
const {t} = useI18n()
const associationStore = useAssociationStore()
const projectStore = useProjectStore()
const {initAssociationCharterStatus} = useCharters()

const applicant = ref<'association' | 'user'>(projectBasicInfos.value.association ? 'association' : 'user')

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
                    applicant === 'association' ? `${projectStore.project?.association.acronym}
                (${projectStore.project?.association.name})` :
                    `${projectStore.project?.user?.firstName} ${projectStore.project?.user?.lastName}`
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
            <p>
                {{
                    `${projectStore.project?.associationUser?.user?.firstName} ${projectStore.project?.associationUser?.user?.lastName}`
                }}
            </p>
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
