<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSubmitProject from '@/composables/useSubmitProject'
import useErrors from '@/composables/useErrors'
import {useQuasar} from 'quasar'
import {useProjectStore} from '@/stores/useProjectStore'
import axios from 'axios'
import {onMounted} from 'vue'

const {t} = useI18n()
const {
    projectGoals,
    patchProjectGoals,
    initProjectGoals
} = useSubmitProject()
const {catchHTTPError} = useErrors()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()

const emit = defineEmits(['updateStep'])

onMounted(async () => {
    loading.show()
    await onGetProjectGoals()
    loading.hide()
})

// GET DATA
function onGetProjectGoals() {
    initProjectGoals()
}

// SUBMIT
async function onSubmitGoals(nextStep: number) {
    loading.show()
    if (projectStore.project) {
        try {
            await patchProjectGoals()
            emit('updateStep', nextStep)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: catchHTTPError(error.response)
                })
            }
        }
    }
    loading.hide()
}
</script>

<template>
    <QForm
        class="flex-column"
        @submit="onSubmitGoals(5)"
    >
        <QInput
            v-model="projectGoals.goals"
            :label="t('project.goals') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-goals')]"
            aria-required="true"
            color="commission"
            data-test="goals-textarea"
            filled
            lazy-rules
            type="textarea"
        />

        <QInput
            v-model="projectGoals.summary"
            :label="t('project.summary') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-summary')]"
            aria-required="true"
            color="commission"
            data-test="summary-textarea"
            filled
            lazy-rules
            type="textarea"
        />

        <QInput
            v-model="projectGoals.plannedActivities"
            :label="t('project.planned-activities') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-activities')]"
            aria-required="true"
            color="commission"
            data-test="planned-activities-textarea"
            filled
            lazy-rules
            type="textarea"
        />

        <QInput
            v-model="projectGoals.preventionSafety"
            :label="t('project.prevention-safety') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-safety')]"
            aria-required="true"
            color="commission"
            data-test="prevention-safety-textarea"
            filled
            lazy-rules
            type="textarea"
        />

        <QInput
            v-model="projectGoals.marketingCampaign"
            :label="t('project.marketing-campaign') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-marketing')]"
            aria-required="true"
            color="commission"
            data-test="marketing-campaign-textarea"
            filled
            lazy-rules
            type="textarea"
        />

        <QInput
            v-model="projectGoals.sustainableDevelopment"
            :label="t('project.sustainable-development') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-project-sustainable')]"
            aria-required="true"
            color="commission"
            data-test="sustainable-development-textarea"
            filled
            lazy-rules
            type="textarea"
        />

        <div class="flex-row-center padding-top padding-bottom">
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                data-test="back-button"
                icon="bi-chevron-left"
                @click="onSubmitGoals(3)"
            />
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