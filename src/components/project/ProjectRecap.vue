<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import ProjectRecapBasicInfos from '@/components/project/ProjectRecapBasicInfos.vue'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import ProjectRecapBudget from '@/components/project/ProjectRecapBudget.vue'
import ProjectRecapGoals from '@/components/project/ProjectRecapGoals.vue'
import ProjectRecapDocuments from '@/components/documents/RecapDocumentList.vue'
import InfoVerifyDocuments from '@/components/infoPanel/InfoVerifyDocuments.vue'

const {t} = useI18n()

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
                        v-if="props.view === 'submitProject'"
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 1)"
                    />
                </div>
                <ProjectRecapBasicInfos/>
            </section>

            <!-- COMMISSION CHOICE -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.commission-choice') }}</h4>
                    <QBtn
                        v-if="props.view === 'submitProject'"
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 2)"
                    />
                </div>
                <ProjectRecapCommissions view="projectRecap"/>
            </section>

            <!-- BUDGET -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.budget') }}</h4>
                    <QBtn
                        v-if="props.view === 'submitProject'"
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 3)"
                    />
                </div>
                <ProjectRecapBudget :load-data="false"/>
            </section>

            <!-- GOALS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.goals') }}</h4>
                    <QBtn
                        v-if="props.view === 'submitProject'"
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 4)"
                    />
                </div>
                <ProjectRecapGoals/>
            </section>

            <!-- DOCUMENTS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.documents') }}</h4>
                    <QBtn
                        v-if="props.view === 'submitProject'"
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="emit('changeStep', 5)"
                    />
                </div>

                <InfoVerifyDocuments v-if="props.view === 'submitProject'"/>
                <ProjectRecapDocuments/>
            </section>
        </section>

        <div
            v-if="props.view === 'submitProject'"
            class="btn-group"
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
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.display-row {
    width: 75% !important;
}
</style>
