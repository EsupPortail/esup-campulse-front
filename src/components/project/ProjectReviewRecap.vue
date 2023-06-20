<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import ProjectReviewRecapBasicInfos from '@/components/project/ProjectReviewRecapBasicInfos.vue'

const {t} = useI18n()

const props = defineProps<{
    view: 'submitProjectReview' | 'projectReviewDetail'
}>()

const emit = defineEmits(['submitProjectReview', 'changeStep', 'getFile'])
</script>

<template>
    <QForm
        @submit.prevent="onSubmitProjectReview"
    >
        <h3 class="title-2">{{ t('recap') }}</h3>

        <section class="recap-sections">
            <!-- BASIC INFOS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.review') }}</h4>
                    <QBtn
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="() => step = 2"
                    />
                </div>
                <ProjectReviewRecapBasicInfos/>
            </section>

            <!-- REVIEW INFOS -->
            <section class="recap-section">
                <div class="recap-section-title">
                    <h4 class="title-3">{{ t('project.review') }}</h4>
                    <QBtn
                        :label="t('modify')"
                        icon="bi-pencil"
                        @click="() => step = 2"
                    />
                </div>

                <section class="flex-section">
                    <div class="display-row">
                        <p class="row-title">{{ t('project.review') }}</p>
                        <p>{{ projectReview.review }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.impact-students') }}</p>
                        <p>{{ projectReview.impactStudents }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.description') }}</p>
                        <p>{{ projectReview.description }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.difficulties') }}</p>
                        <p>{{ projectReview.difficulties }}</p>
                    </div>

                    <div class="display-row">
                        <p class="row-title">{{ t('project.improvements') }}</p>
                        <p>{{ projectReview.improvements }}</p>
                    </div>
                </section>
            </section>
        </section>

        <!-- DOCUMENTS -->
        <section class="recap-section">
            <div class="recap-section-title">
                <h4 class="title-3">{{ t('project.documents') }}</h4>
                <QBtn
                    :label="t('modify')"
                    icon="bi-pencil"
                    @click="() => step = 3"
                />
            </div>

            <div class="info-panel info-panel-warning">
                <i
                    aria-hidden="true"
                    class="bi bi-exclamation-lg"
                ></i>
                <p>{{ t('project.document.verify') }}</p>
            </div>
        </section>
        <FormProjectRecapDocuments/>
        <section class="form-page-navigation">
            <QBtn
                :label="t('back')"
                icon="bi-chevron-left"
                @click="step = 3"
            />
            <QBtn
                :label="t('project.submit-review')"
                icon-right="bi-check2"
                type="submit"
            />
        </section>
    </QForm>
</template>