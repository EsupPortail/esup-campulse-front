<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {ProjectInfos} from '#/project'
import type {SelectLabel} from '#/global'
import type {User} from '#/user'
import FormUserAddress from '@/components/user/FormUserAddress.vue'
import InfoFormRequiredFields from '@/components/global/InfoFormRequiredFields.vue'

const {t} = useI18n()

const projectInfos = defineModel<ProjectInfos>('projectInfos', {required: true})
const projectCategory = defineModel<number | null>('projectCategory', {required: true})

const props = defineProps<{
  projectCategoryLabels: SelectLabel[],
  associationUserLabels: SelectLabel[],
  applicant: 'association' | 'user',
  datesAreLegal: boolean,
  user: User | undefined
}>()

const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <QForm
    class="flex-column"
    @submit.prevent="emit('submit')"
  >
    <InfoFormRequiredFields/>
    <QInput
      v-model="projectInfos.name"
      :label="t('project.name') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-name'),
               val => val && val.length < 100 || t('forms.project-name-under-100')]"
      aria-required="true"
      clearable
      color="commission"
      filled
      lazy-rules
    />
    <QInput
      v-model="projectInfos.plannedStartDate"
      :label="t('project.planned-start-date') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-startdate'),
               val => val && props.datesAreLegal || t('forms.legal-dates')]"
      aria-required="true"
      clearable
      color="commission"
      filled
      max="2120-01-01"
      min="1970-01-01"
      reactive-rules
      type="date"
    />
    <QInput
      v-model="projectInfos.plannedEndDate"
      :label="t('project.planned-end-date') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-enddate'),
               val => val && props.datesAreLegal || t('forms.legal-dates')]"
      aria-required="true"
      clearable
      color="commission"
      filled
      max="2120-01-01"
      min="1970-01-01"
      reactive-rules
      type="date"
    />
    <QInput
      v-model="projectInfos.plannedLocation"
      :label="t('project.planned-location') + ' *'"
      :rules="[val => val && val.length > 0 || t('forms.required-project-location')]"
      aria-required="true"
      clearable
      color="commission"
      filled
      lazy-rules
    />
    <QSelect
      v-model="projectCategory"
      :label="t('project.categories') + ' *'"
      :options="props.projectCategoryLabels"
      :rules="[val => val !== null || t('forms.required-project-categories')]"
      clearable
      color="commission"
      emit-value
      filled
      lazy-rules
      map-options
    />
    <div v-if="props.applicant === 'association'">
      <QSelect
        v-model="projectInfos.associationUser"
        :label="t('project.association-user') + ' *'"
        :options="props.associationUserLabels"
        :rules="[val => val !== null || t('forms.required-project-association-user')]"
        clearable
        color="commission"
        emit-value
        filled
        lazy-rules
        map-options
      />
    </div>
    <div v-else>
      <div class="info-panel info-panel-warning">
        <i
          aria-hidden="true"
          class="bi bi-info"
        ></i>
        <p>{{ t('address.verify') }}</p>
      </div>
      <FormUserAddress
        :edited-by-manager="false"
        :user="props.user"
        color="commission"
      />
    </div>
    <QInput
      v-if="props.applicant === 'association'"
      v-model="projectInfos.partnerAssociation"
      :label="t('project.partner-association')"
      clearable
      color="commission"
      filled
      lazy-rules
    />
    <div class="flex-row-center padding-top padding-bottom">
      <QBtn
        :label="t('continue')"
        class="btn-lg"
        color="commission"
        icon="bi-check2"
        type="submit"
      />
    </div>
  </QForm>
</template>
