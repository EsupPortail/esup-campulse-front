<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useSubmitProject from '@/composables/useSubmitProject'
import useUtility from '@/composables/useUtility'
import {useProjectStore} from '@/stores/useProjectStore'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const {projectBasicInfos, postNewProject} = useSubmitProject()
const {fromDateIsAnterior} = useUtility()
const {loading, notify} = useQuasar()
const projectStore = useProjectStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(() => {
    loading.show
    initApplicant()
    onGetProjectCategories()
    loading.hide
})

const step = ref(1)
const done1 = ref(false)
const done2 = ref(false)
const done3 = ref(false)

const applicant = ref<'association' | 'user' | undefined>()

const datesAreLegal = ref<boolean>(false)
watch(() => projectBasicInfos.value.plannedStartDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})
watch(() => projectBasicInfos.value.plannedEndDate, () => {
    datesAreLegal.value = fromDateIsAnterior(projectBasicInfos.value.plannedStartDate, projectBasicInfos.value.plannedEndDate)
})

const initApplicant = () => {
    if (route.name === 'SubmitProjectAssociation') {
        projectBasicInfos.value.association = parseInt(route.params.id as string)
        applicant.value = 'association'
    } else {
        projectBasicInfos.value.user = userStore.user?.id as number
        applicant.value = 'user'
    }
}
watch(() => userStore.user, initApplicant)

async function onGetProjectCategories() {
    try {
        await projectStore.getProjectCategories()
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onSubmitBasicInfos() {
    try {
        await postNewProject()
        done2.value = true
        step.value = 3
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.project-creation-error')
        })
    }
}
</script>

<template>
    <section class="dashboard-section">
        <div class="form-title">
            <h2>
                <i
                    aria-hidden="true"
                    class="bi bi-pencil-square"
                ></i>
                {{ t('project.submit') }}
            </h2>
        </div>

        <div class="form-container">
            <div class="form">
                <div class="q-pa-md">
                    <QStepper
                        ref="stepper"
                        v-model="step"
                        animated
                        header-nav
                    >
                        <QStep
                            :done="done1"
                            :name="1"
                            :title="t('project.before-start')"
                            icon="mdi-lightbulb-outline"
                        >
                            <h4 class="title-3">{{ t('project.before-start') }}</h4>

                            <p>
                                Vous êtes sur le point de commencer une demande de subventionnement en tant que
                                représentant ou représentante de l'association X.
                            </p>
                            <p>
                                Avant de débuter la procédure, assurez-vous de disposer des documents suivants
                                numérisés :
                            </p>
                            <ul>
                                <li>...</li>
                            </ul>

                            <QStepperNavigation>
                                <QBtn
                                    :label="t('continue')"
                                    @click="() => { done1 = true; step = 2 }"
                                />
                            </QStepperNavigation>
                        </QStep>

                        <QStep
                            :done="done2"
                            :name="2"
                            :title="t('project.general-infos')"
                        >
                            <QForm
                                @submit.prevent="onSubmitBasicInfos"
                            >
                                <h4 class="title-3">{{ t('project.general-infos') }}</h4>

                                <QInput
                                    v-model="projectBasicInfos.name"
                                    :label="t('project.name') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                />
                                <QInput
                                    v-model="projectBasicInfos.plannedStartDate"
                                    :label="t('project.planned-start-date') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="date"
                                />
                                <QInput
                                    v-model="projectBasicInfos.plannedEndDate"
                                    :label="t('project.planned-end-date') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field'), val => val && datesAreLegal || t('forms.legal-dates')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                    type="date"
                                />
                                <QInput
                                    v-model="projectBasicInfos.location"
                                    :label="t('project.location') + ' *'"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    aria-required="true"
                                    filled
                                    lazy-rules
                                />
                                <QSelect
                                    v-model="projectBasicInfos.categories"
                                    :label="t('project.categories') + ' *'"
                                    :options="projectStore.projectCategoriesLabels"
                                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                                    emit-value
                                    filled
                                    lazy-rules
                                    map-options
                                    multiple
                                    stack-label
                                    use-chips
                                />
                                <QStepperNavigation>
                                    <QBtn
                                        :label="t('continue')"
                                        type="submit"
                                    />
                                    <QBtn
                                        :label="t('back')"
                                        class="q-ml-sm"
                                        flat
                                        @click="step = 1"
                                    />
                                </QStepperNavigation>
                            </QForm>
                        </QStep>

                        <QStep
                            :done="done3"
                            :name="3"
                            icon="add_comment"
                            title="Create an ad"
                        >
                            Try out different ad text to see what brings in the most customers, and learn how to
                            enhance your ads using features like ad extensions. If you run into any problems with
                            your ads, find out how to tell if they're running and how to resolve approval issues.

                            <QStepperNavigation>
                                <QBtn
                                    color="primary"
                                    label="Finish"
                                    @click="done3 = true"
                                />
                                <QBtn
                                    class="q-ml-sm"
                                    color="primary"
                                    flat
                                    label="Back"
                                    @click="step = 2"
                                />
                            </QStepperNavigation>
                        </QStep>
                    </QStepper>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>