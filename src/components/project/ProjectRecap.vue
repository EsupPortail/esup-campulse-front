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
        class="flex-column"
        @submit.prevent="emit('submitProject')"
    >
        <!--        <h3
                    v-if="props.view === 'submitProject'"
                    class="title-2"
                >
                    {{ t('recap') }}
                </h3>-->

        <div class="flex-column">
            <!-- BASIC INFOS -->
            <div
                class="flex-row-space-between"
            >
                <h3>{{ t('project.general-infos') }}</h3>
                <QBtn
                    v-if="props.view === 'submitProject'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="commission"
                    icon="bi-pencil"
                    @click="emit('changeStep', 1)"
                />
            </div>
            <ProjectRecapBasicInfos/>

            <!-- COMMISSION CHOICE -->
            <div
                class="flex-row-space-between padding-top padding-bottom"
            >
                <h3>{{ t('project.commission-choice') }}</h3>
                <QBtn
                    v-if="props.view === 'submitProject'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="commission"
                    icon="bi-pencil"
                    @click="emit('changeStep', 2)"
                />
            </div>
            <ProjectRecapCommissions view="projectRecap"/>

            <!-- BUDGET -->
            <div
                class="flex-row-space-between padding-top padding-bottom"
            >
                <h3>{{ t('project.budget') }}</h3>
                <QBtn
                    v-if="props.view === 'submitProject'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="commission"
                    icon="bi-pencil"
                    @click="emit('changeStep', 3)"
                />
            </div>
            <ProjectRecapBudget :load-data="false"/>

            <!-- GOALS -->
            <div
                class="flex-row-space-between padding-top padding-bottom"
            >
                <h3>{{ t('project.goals') }}</h3>
                <QBtn
                    v-if="props.view === 'submitProject'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="commission"
                    icon="bi-pencil"
                    @click="emit('changeStep', 4)"
                />
            </div>
            <ProjectRecapGoals/>

            <!-- DOCUMENTS -->
            <div
                class="flex-row-space-between padding-top padding-bottom"
            >
                <h3>{{ t('project.documents') }}</h3>
                <QBtn
                    v-if="props.view === 'submitProject'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="commission"
                    icon="bi-pencil"
                    @click="emit('changeStep', 5)"
                />
            </div>

            <InfoVerifyDocuments v-if="props.view === 'submitProject'"/>
            <ProjectRecapDocuments
                :association-id="null"
                process="project"
            />
        </div>

        <div
            v-if="props.view === 'submitProject'"
            class="flex-row-center"
        >
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                data-test="back-button"
                icon="bi-chevron-left"
                @click="emit('changeStep', 5)"
            />
            <QBtn
                :label="t('project.submit')"
                class="btn-lg"
                color="commission"
                data-test="submit-button"
                icon="bi-check2"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import '@/assets/_variables.scss';
</style>
