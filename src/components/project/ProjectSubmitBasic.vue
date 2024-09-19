<script lang="ts" setup>
import FormUserAddress from '@/components/form/FormUserAddress.vue'
import InfoFormRequiredFields from '@/components/infoPanel/InfoFormRequiredFields.vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useRoute} from 'vue-router'
import useSubmitProject from '@/composables/useSubmitProject'
import {useProjectStore} from '@/stores/useProjectStore'
import {onMounted, ref, watch} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import useUtility from '@/composables/useUtility'


const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const route = useRoute()
const {
    projectBasicInfos,
    postNewProject,
    projectCategories,
    updateProjectCategories,
    patchProjectBasicInfos,
    projectAssociationUsersLabels,
    initProjectBasicInfos
} = useSubmitProject()
const projectStore = useProjectStore()
const userStore = useUserStore()
const {fromDateIsAnterior} = useUtility()

const props = defineProps<{
    applicant: 'association' | 'user' | undefined,
    newProject: boolean,
    newProjectPosted: boolean
}>()

const emit = defineEmits(['updateStep', 'updatePostedStatus', 'getProjectCategories'])

onMounted(() => {
    loading.show()
    initProjectBasicInfos()
    loading.hide()
})

async function onSubmitBasicInfos(nextStep: number) {
    loading.show()
    try {
        if (props.newProject && !props.newProjectPosted) {
            await postNewProject(parseInt(route.params.associationId as string))
            emit('updatePostedStatus')
        } else {
            await patchProjectBasicInfos()
        }
        await updateProjectCategories()
        emit('getProjectCategories')
        emit('updateStep', nextStep)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

// CHECKING IF PROJECT BASIC INFOS DATES ARE LEGAL
const datesAreLegal = ref<boolean>(true)
watch(() => projectBasicInfos.value.plannedStartDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate,
        projectBasicInfos.value.plannedEndDate, true)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate,
        projectBasicInfos.value.plannedEndDate, true)
})
</script>

<template>
    <QForm
        class="flex-column"
        @submit="onSubmitBasicInfos(2)"
    >
        <InfoFormRequiredFields/>
        <QInput
            v-model="projectBasicInfos.name"
            :label="t('project.name') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-name')]"
            aria-required="true"
            clearable
            color="commission"
            data-test="name-input"
            filled
            lazy-rules
        />
        <QInput
            v-model="projectBasicInfos.plannedStartDate"
            :label="t('project.planned-start-date') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-startdate'),
                     val => val && datesAreLegal || t('forms.legal-dates')]"
            aria-required="true"
            clearable
            color="commission"
            data-test="planned-start-date-input"
            filled
            max="2120-01-01"
            min="1970-01-01"
            reactive-rules
            type="date"
        />
        <QInput
            v-model="projectBasicInfos.plannedEndDate"
            :label="t('project.planned-end-date') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-enddate'),
                     val => val && datesAreLegal || t('forms.legal-dates')]"
            aria-required="true"
            clearable
            color="commission"
            data-test="planned-end-date-input"
            filled
            max="2120-01-01"
            min="1970-01-01"
            reactive-rules
            type="date"
        />
        <QInput
            v-model="projectBasicInfos.plannedLocation"
            :label="t('project.planned-location') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-location')]"
            aria-required="true"
            clearable
            color="commission"
            data-test="planned-location-input"
            filled
            lazy-rules
        />
        <QSelect
            v-model="projectCategories"
            :hint="t('forms.multiple-choices-enabled')"
            :label="t('project.categories') + ' *'"
            :options="projectStore.projectCategoriesLabels"
            :rules="[val => val && val.length > 0 || t('forms.required-project-categories')]"
            clearable
            color="commission"
            data-test="categories-select"
            emit-value
            filled
            lazy-rules
            map-options
            multiple
            use-chips
        />
        <div v-if="props.applicant === 'association'">
            <QSelect
                v-model="projectBasicInfos.associationUser"
                :label="t('project.association-user') + ' *'"
                :options="projectAssociationUsersLabels"
                :rules="[val => val || t('forms.required-project-association-user')]"
                clearable
                color="commission"
                data-test="association-select"
                emit-value
                filled
                lazy-rules
                map-options
            />
        </div>
        <div v-else>
            <div class="info-panel info-panel-warning">
                <i
                    aria-hidden="true"
                    class="bi bi-info"
                ></i>
                <p>{{ t('address.verify') }}</p>
            </div>
            <FormUserAddress
                :edited-by-staff="false"
                :user="userStore.user"
                color="commission"
            />
        </div>
        <QInput
            v-if="props.applicant === 'association'"
            v-model="projectBasicInfos.partnerAssociation"
            :label="t('project.partner-association')"
            clearable
            color="commission"
            data-test="partner-association-input"
            filled
            lazy-rules
        />
        <div class="flex-row-center padding-top padding-bottom">
            <QBtn
                :label="t('continue')"
                class="btn-lg"
                color="commission"
                data-test="continue-button"
                icon="bi-check2"
                type="submit"
            />
        </div>
    </QForm>
</template>