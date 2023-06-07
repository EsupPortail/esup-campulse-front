<script lang="ts" setup>
import type {ProcessDocument} from '#/documents'
import ProjectCommentForm from '@/components/project/ProjectCommentForm.vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import useProjectDocuments from '@/composables/useProjectDocuments'
import router from '@/router'
import {onMounted} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitProject from '@/composables/useSubmitProject'
import {useRoute} from 'vue-router'
import useCommissions from '@/composables/useCommissions'
import useUtility from '@/composables/useUtility'

const {notify, loading} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {getFile, processDocuments, documentUploads, getDocuments, initProcessProjectDocuments} = useProjectDocuments()
const projectStore = useProjectStore()
const {
    initProjectBasicInfos,
    initProjectGoals,
    initProjectBudget,
    projectBasicInfos,
    projectBudget,
    projectGoals
} = useSubmitProject()
const {commissionDatesLabels, commissionDates, commissions} = useCommissions()
const route = useRoute()
const {CURRENCY} = useUtility()

onMounted(async () => {
    loading.show()
    await onGetProjectDetail()
    await onGetProjectDocuments()
    loading.hide()
})

async function onGetProjectDetail() {
    try {
        await projectStore.getProjectDetail(parseInt(route.params.projectId as string))
        initProjectBasicInfos()
        initProjectBudget()
        initProjectGoals()
    } catch (error) {
        await router.push({name: '404'})
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetProjectDocuments() {
    try {
        await getDocuments('DOCUMENT_PROJECT')
        initProcessProjectDocuments()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetFile(uploadedDocument: ProcessDocument) {
    try {
        const file = await getFile(uploadedDocument.pathFile as string)
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(file)
        link.download = uploadedDocument.name as string
        document.body.appendChild(link)
        link.click()
        link.remove()
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
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-info-circle"
            ></i>
            {{ t('project.general-infos') }}
        </h2>
        <div class="form-container">
            <div class="form">
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

                    <div class="display-row">
                        <p class="row-title">{{ t('project.other-first-name') }}</p>
                        <p>{{ projectBasicInfos.otherFirstName }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.other-last-name') }}</p>
                        <p>{{ projectBasicInfos.otherLastName }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.other-email') }}</p>
                        <p>{{ projectBasicInfos.otherEmail }}</p>
                    </div>
                </section>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-calendar"
            ></i>
            {{ t('project.commission-choice') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <section class="recap-chips">
                    <QChip
                        v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                        :key="index"
                    >
                        {{
                            commissionDatesLabels.find(obj => obj.value === commissionDate.commissionDate)?.label
                        }}
                    </QChip>
                </section>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-piggy-bank"
            ></i>
            {{ t('project.budget') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <section class="flex-section">
                    <div class="display-row">
                        <p class="row-title">{{ t('project.re-edition') }}</p>
                        <p>
                            {{
                                projectStore.projectCommissionDates.find(obj => obj.isFirstEdition === false) ? t('yes') : t('no')
                            }}
                        </p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.target-audience') }}</p>
                        <p>{{ projectBudget.targetAudience }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.target-students-amount') }}</p>
                        <p>{{ projectBudget.amountStudentsAudience }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.target-all-amount') }}</p>
                        <p>{{ projectBudget.amountAllAudience }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.ticket-price') }}</p>
                        <p>{{ projectBudget.ticketPrice + CURRENCY }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.individual-cost') }}</p>
                        <p>{{ projectBudget.individualCost + CURRENCY }}</p>
                    </div>

                    <div
                        v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                        :key="index"
                        class="display-row"
                    >
                        <p class="row-title">
                            {{
                                `${t('project.amount-asked')}
                                    (${commissions.find(obj => obj.id === commissionDates.find(obj => obj.id === commissionDate.commissionDate)?.commission)?.acronym})`
                            }}
                        </p>
                        <p>{{ commissionDate.amountAsked + CURRENCY }}</p>
                    </div>

                    <section
                        v-if="projectStore.projectCommissionDates.find(obj => obj.isFirstEdition === false)"
                        class="flex-section"
                    >
                        <h5 class="title-4">{{ t('project.previous-edition') }}</h5>

                        <div
                            v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                            :key="index"
                            class="display-row"
                        >
                            <p class="row-title">
                                {{
                                    `${t('project.previous-asked')}
                                        (${commissions.find(obj => obj.id === commissionDates
                                    .find(obj => obj.commission === commissionDate.commissionDate)?.commission)?.acronym})`
                                }}
                            </p>
                            <p>{{ commissionDate.amountAskedPreviousEdition + CURRENCY }}</p>
                        </div>

                        <div
                            v-for="(commissionDate, index) in projectStore.projectCommissionDates"
                            :key="index"
                            class="display-row"
                        >
                            <p class="row-title">
                                {{
                                    `${t('project.previous-earned')}
                                        (${commissions.find(obj => obj.id === commissionDates
                                    .find(obj => obj.commission === commissionDate.commissionDate)?.commission)?.acronym})`
                                }}
                            </p>
                            <p>{{ commissionDate.amountEarnedPreviousEdition + CURRENCY }}</p>
                        </div>

                        <div class="display-row">
                            <p class="row-title">{{ t('project.budget-previous-edition') }}</p>
                            <p>{{ projectBudget.budgetPreviousEdition + CURRENCY }}</p>
                        </div>
                    </section>
                </section>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-flag"
            ></i>
            {{ t('project.goals') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <section class="flex-section">
                    <div class="display-row">
                        <p class="row-title">{{ t('project.goals-title') }}</p>
                        <p>{{ projectGoals.goals }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.summary') }}</p>
                        <p>{{ projectGoals.summary }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.planned-activities') }}</p>
                        <p>{{ projectGoals.plannedActivities }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.prevention-safety') }}</p>
                        <p>{{ projectGoals.preventionSafety }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.marketing-campaign') }}</p>
                        <p>{{ projectGoals.marketingCampaign }}</p>
                    </div>
                </section>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-file-earmark"
            ></i>
            {{ t('project.documents') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <section class="flex-section">
                    <div
                        v-for="(document, index) in processDocuments"
                        :key="index"
                        class="display-row"
                    >
                        <p class="row-title">{{ document.description }}</p>
                        <p class="paragraph">
                            <ul role="list">
                                <li
                                    v-for="uploadedDocument in documentUploads.filter(obj => obj.document === document.document)"
                                    :key="uploadedDocument.id"
                                    @click="onGetFile"
                                >
                                    {{ uploadedDocument.name }}
                                </li>
                            </ul>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    </section>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-chat"
            ></i>
            {{ t('project.comments.title') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <ProjectCommentForm/>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.form, .display-row {
    width: 80% !important;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1rem
}
</style>
