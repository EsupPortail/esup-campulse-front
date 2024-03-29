<script lang="ts" setup>
import useUtility from '@/composables/useUtility'
import useSubmitReview from '@/composables/useSubmitReview'
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import {onMounted, ref} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import useUserGroups from '@/composables/useUserGroups'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'

const {t} = useI18n()
const {formatDate, CURRENCY} = useUtility()
const {projectReview, projectId} = useSubmitReview()
const {userToUpdate} = useUsers()
const userStore = useUserStore()
const {isStaff} = useUserGroups()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()

const applicant = ref<string | undefined>('')

const initApplicant = async () => {
    if (isStaff.value) {
        if (projectReview.value.association) {
            const associationId = projectReview.value.association
            await associationStore.getAssociationDetail(associationId, true)
            applicant.value = associationStore.association?.name
        } else {
            const userId = projectReview.value.user
            await userManagerStore.getUserDetail(userId as number)
            applicant.value = userManagerStore.user?.firstName + ' ' + userManagerStore.user?.lastName
        }
    } else {
        if (projectReview.value.user) applicant.value = `${userStore.user?.firstName} ${userStore.user?.lastName}`
        else applicant.value = userStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.name
    }
}

onMounted(async () => {
    await initApplicant()
})
</script>

<template>
    <div class="flex-column">
        <div class="display-row">
            <p class="row-title">{{ t('project.id') }}</p>
            <p>{{ projectId }}</p>
        </div>

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
                    formatDate(projectReview.realStartDate)?.split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-end-date') }}</p>
            <p>
                {{
                    formatDate(projectReview.realEndDate)?.split('-').reverse().join('/')
                }}
            </p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.planned-location') }}</p>
            <p>{{ projectReview.realLocation }}</p>
        </div>

        <h4
            v-if="projectReview.user"
        >
            {{ t('project.contact-infos') }}
        </h4>

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

        <h4>
            {{
                t('project.outcome') + ' / ' + t('project.income')
            }}
        </h4>

        <div class="display-row">
            <p class="row-title">{{ t('project.outcome') }}</p>
            <p>{{ projectReview.outcome + CURRENCY }}</p>
        </div>

        <div class="display-row">
            <p class="row-title">{{ t('project.income') }}</p>
            <p>{{ projectReview.income + CURRENCY }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
