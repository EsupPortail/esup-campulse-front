<script lang="ts" setup>
import {useProjectStore} from '@/stores/useProjectStore'
import useUtility from '@/composables/useUtility'
import useSubmitReview from '@/composables/useSubmitReview'
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import {onMounted, ref} from 'vue'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const projectStore = useProjectStore()
const {formatDate, CURRENCY} = useUtility()
const {projectReview} = useSubmitReview()
const {userToUpdate} = useUsers()
const userStore = useUserStore()

const applicant = ref<string | undefined>('')

const initApplicant = () => {
    if (projectReview.value.user) applicant.value = `${userStore.user?.firstName} ${userStore.user?.lastName}`
    else applicant.value = userStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.name
}

onMounted(initApplicant)
</script>

<template>
    <section class="flex-section">
        <div class="display-row">
            <p class="row-title">{{ t('project.applicant') }}</p>
            <p>{{ applicant }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.name') }}</p>
            <p>{{ projectReview.name }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-start-date') }}</p>
            <p>
                {{
                    formatDate(projectReview.realStartDate).split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-end-date') }}</p>
            <p>
                {{
                    formatDate(projectReview.realEndDate).split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-location') }}</p>
            <p>{{ projectReview.realLocation }}</p>
        </div>

        <h5
            v-if="projectReview.user"
            class="title-4"
        >
            {{ t('project.contact-infos') }}
        </h5>

        <section
            v-if="projectReview.user"
            class="flex-section"
        >
            <div class="display-row">
                <p class="row-title">{{ t('address.address') }}</p>
                <p>
                    {{ userToUpdate.address }}<br/>
                    {{ userToUpdate.zipcode + ' ' + userToUpdate.city }}<br/>
                    {{ userToUpdate.country }}
                </p>
            </div>
        </section>

        <h5 class="title-4">{{ t('commission.dates') }}</h5>

        <ProjectRecapCommissions :view="'projectReviewRecap'"/>

        <h5 class="title-4">
            {{
                t('project.outcome') + ' / ' + t('project.income')
            }}
        </h5>

        <div class="display-row">
            <p class="row-title">{{ t('project.outcome') }}</p>
            <p>{{ projectReview.outcome + CURRENCY }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.income') }}</p>
            <p>{{ projectReview.income + CURRENCY }}</p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';

.display-row {
    width: 100% !important;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}
</style>