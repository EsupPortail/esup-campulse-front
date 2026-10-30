<script lang="ts" setup>
import useUtil from '@/composables/useUtil'
import useSubmitReview from '@/composables/useProjectReview'
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUser'
import ProjectRecapCommissions from '@/components/project/ProjectRecapCommissions.vue'
import {onMounted, ref} from 'vue'
import {useProfileStore} from '@/stores/useProfileStore'
import useUserGroups from '@/composables/useUserGroup'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserStore} from '@/stores/useUserStore'

const {t} = useI18n()
const {formatDate, CURRENCY} = useUtil()
const {projectReview, projectId} = useSubmitReview()
const {userToUpdate} = useUsers()
const profileStore = useProfileStore()
const {isStaff} = useUserGroups()
const associationStore = useAssociationStore()
const userStore = useUserStore()

const applicant = ref<string | undefined>('')

const initApplicant = async () => {
  if (isStaff.value) {
    if (projectReview.value.association) {
      const associationId = projectReview.value.association
      await associationStore.getAssociationDetail(associationId, true)
      applicant.value = associationStore.association?.name
    } else {
      const userId = projectReview.value.user
      await userStore.getUserDetail(userId as number)
      applicant.value = userStore.user?.firstName + ' ' + userStore.user?.lastName
    }
  } else if (projectReview.value.user) {
    applicant.value = `${profileStore.user?.firstName} ${profileStore.user?.lastName}`
  } else {
    applicant.value = profileStore.user?.associations.find(obj => obj.id === projectReview.value.association)?.name
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
