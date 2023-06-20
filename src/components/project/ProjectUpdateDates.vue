<script lang="ts" setup>
import {ref, toRefs, watch} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import useUtility from '@/composables/useUtility'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {projectBasicInfos, initProjectBasicInfos, reInitSubmitProjectForm, patchProjectBasicInfos} = useSubmitProject()
const {fromDateIsAnterior} = useUtility()

const emit = defineEmits(['closeDialog'])

const props = defineProps<{
    openDialog: boolean,
    project: number
}>()

const openRef = toRefs(props).openDialog

const open = ref<boolean>(false)

watch(() => openRef.value, () => {
    open.value = openRef.value
})

watch(() => open.value, () => {
    if (!open.value) {
        emit('closeDialog')
    }
})

watch(() => open.value, async () => {
    loading.show()
    if (open.value) {
        try {
            await projectStore.getProjectDetail(props.project)
            initProjectBasicInfos()
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
        }
    }
    loading.hide()
})

async function onUpdateProjectDates() {
    loading.show()
    try {
        await patchProjectBasicInfos()
        reInitSubmitProjectForm()
        emit('closeDialog')
        notify({
            type: 'positive',
            message: t('notifications.positive.project-dates-updated')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection>
                <h2 class="title-2">{{ t('project.edit-dates') }}</h2>

                <QForm
                    @submit="onUpdateProjectDates"
                >
                    <fieldset>
                        <legend>{{ t('project.update-dates') }}</legend>
                        <QInput
                            v-model="projectBasicInfos.plannedStartDate"
                            :label="t('project.planned-start-date') + ' *'"
                            :rules="[ val => val && val.length > 0 || t('forms.fill-field'),
                                      val => val && fromDateIsAnterior(projectBasicInfos.plannedStartDate, projectBasicInfos.plannedEndDate, true) || t('forms.legal-dates')]"
                            aria-required="true"
                            clearable
                            filled
                            reactive-rules
                            type="date"
                        />
                        <QInput
                            v-model="projectBasicInfos.plannedEndDate"
                            :label="t('project.planned-end-date') + ' *'"
                            :rules="[ val => val && val.length > 0 || t('forms.fill-field'),
                                      val => val && fromDateIsAnterior(projectBasicInfos.plannedStartDate, projectBasicInfos.plannedEndDate, true) || t('forms.legal-dates')]"
                            aria-required="true"
                            clearable
                            filled
                            reactive-rules
                            type="date"
                        />
                    </fieldset>
                    <QCardActions align="right">
                        <QBtn
                            v-close-popup
                            :label="t('cancel')"
                            icon="bi-box-arrow-left"
                            @click="emit('closeDialog')"
                        />
                        <QBtn
                            v-close-popup
                            :label="t('validate')"
                            icon="bi-check-lg"
                            type="submit"
                        />
                    </QCardActions>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.q-card {
    padding: 1rem
}
</style>