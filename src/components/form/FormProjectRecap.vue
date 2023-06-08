<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useSubmitProject from '@/composables/useSubmitProject'
import {useProjectStore} from '@/stores/useProjectStore'
import useCommissions from '@/composables/useCommissions'
import useUtility from '@/composables/useUtility'
import useProjectDocuments from '@/composables/useProjectDocuments'

const {t} = useI18n()
const {projectBasicInfos, projectBudget, projectGoals} = useSubmitProject()
const projectStore = useProjectStore()
const {fundsLabels, commissionFunds} = useCommissions()
const {processDocuments, documentUploads} = useProjectDocuments()
const {CURRENCY} = useUtility()

const props = defineProps<{
    view: 'submitProject' | 'projectDetail'
}>()

const emit = defineEmits(['submitProject', 'changeStep', 'getFile'])

</script>

<template>
    <QForm
        @submit.prevent="emit('submitProject')"
    >
        <h3
            v-if="props.view === 'submitProject'"
            class="title-2"
        >
            {{ t('recap') }}
        </h3>

        <section class="recap-sections">
            <!-- BASIC INFOS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.general-infos') }}</h4>
                    <QBtn
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 1)"
                        v-if="props.view === 'submitProject'"
                    />
                </div>

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
                        <p class="row-title">{{ t('project.contact-first-name') }}</p>
                        <p>{{ projectBasicInfos.contactFirstName }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.contact-last-name') }}</p>
                        <p>{{ projectBasicInfos.contactLastName }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.contact-email') }}</p>
                        <p>{{ projectBasicInfos.contactEmail }}</p>
                    </div>
                </section>
            </section>

            <!-- COMMISSION CHOICE -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.commission-choice') }}</h4>
                    <QBtn
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 2)"
                        v-if="props.view === 'submitProject'"
                    />
                </div>

                <section class="recap-chips">
                    <QChip
                        v-for="commissionFund in projectStore.projectCommissionFunds"
                        :key="commissionFund.id"
                    >
                        {{
                            fundsLabels.find(obj => obj.value === (commissionFunds
                                .find(obj => obj.id === commissionFund.commissionFund).fund))?.label
                        }}
                    </QChip>
                </section>
            </section>

            <!-- BUDGET -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.budget') }}</h4>
                    <QBtn
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 3)"
                        v-if="props.view === 'submitProject'"
                    />
                </div>

                <section class="flex-section">
                    <div class="display-row">
                        <p class="row-title">{{ t('project.re-edition') }}</p>
                        <p>
                            {{
                                projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false) ? t('yes') : t('no')
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
                        v-for="commissionFund in projectStore.projectCommissionFunds"
                        :key="commissionFund.id"
                        class="display-row"
                    >
                        <p class="row-title">
                            {{
                                `${t('project.amount-asked')}
                                    (${fundsLabels.find(obj => obj.value === (commissionFunds
                                .find(obj => obj.id === commissionFund.commissionFund).fund))?.label})`
                            }}
                        </p>
                        <p>{{ commissionFund.amountAsked + CURRENCY }}</p>
                    </div>

                    <section
                        v-if="projectStore.projectCommissionFunds.find(obj => obj.isFirstEdition === false)"
                        class="flex-section"
                    >
                        <h5 class="title-4">{{ t('project.previous-edition') }}</h5>

                        <div
                            v-for="commissionFund in projectStore.projectCommissionFunds"
                            :key="commissionFund.id"
                            class="display-row"
                        >
                            <p class="row-title">
                                {{
                                    `${t('project.previous-asked')}
                                        (${fundsLabels.find(obj => obj.value === (commissionFunds
                                    .find(obj => obj.id === commissionFund.commissionFund).fund))?.label})`
                                }}
                            </p>
                            <p>{{ commissionFund.amountAskedPreviousEdition + CURRENCY }}</p>
                        </div>

                        <div
                            v-for="commissionFund in projectStore.projectCommissionFunds"
                            :key="commissionFund.id"
                            class="display-row"
                        >
                            <p class="row-title">
                                {{
                                    `${t('project.previous-earned')}
                                        (${fundsLabels.find(obj => obj.value === (commissionFunds
                                    .find(obj => obj.id === commissionFund.commissionFund).fund))?.label})`
                                }}
                            </p>
                            <p>{{ commissionFund.amountEarnedPreviousEdition + CURRENCY }}</p>
                        </div>

                        <div class="display-row">
                            <p class="row-title">{{ t('project.budget-previous-edition') }}</p>
                            <p>{{ projectBudget.budgetPreviousEdition + CURRENCY }}</p>
                        </div>
                    </section>
                </section>
            </section>

            <!-- GOALS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.goals') }}</h4>
                    <QBtn
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 4)"
                        v-if="props.view === 'submitProject'"
                    />
                </div>

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
            </section>

            <!-- DOCUMENTS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.documents') }}</h4>
                    <QBtn
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 5)"
                        v-if="props.view === 'submitProject'"
                    />
                </div>

                <div
                    class="info-panel info-panel-warning"
                    v-if="props.view === 'submitProject'"
                >
                    <i
                        aria-hidden="true"
                        class="bi bi-exclamation-lg"
                    ></i>
                    <p>{{ t('project.document.verify') }}</p>
                </div>

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
                                    @click="emit('getFile', uploadedDocument)"
                                >
                                    {{ uploadedDocument.name }}
                                </li>
                            </ul>
                        </p>
                    </div>
                </section>
            </section>
        </section>

        <section
            class="form-page-navigation"
            v-if="props.view === 'submitProject'"
        >
            <QBtn
                :label="t('back')"
                icon="bi-chevron-left"
                @click="emit('changeStep', 5)"
            />
            <QBtn
                :label="t('project.submit')"
                icon-right="bi-check2"
                type="submit"
            />
        </section>
    </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.display-row {
    width: 75% !important;
}
</style>
