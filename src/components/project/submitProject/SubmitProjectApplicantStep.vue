<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {ProjectInfos} from '#/project'
import type {SelectLabel} from '#/global'
import InfoFormRequiredFields from '@/components/global/InfoFormRequiredFields.vue'

const {t} = useI18n()

const projectInfos = defineModel<ProjectInfos>('projectInfos', {required: true})
const applicant = defineModel<'association' | 'user' | null>('applicant', {required: true})
const associationId = defineModel<number | null>('associationId', {required: true})

const props = defineProps<{
  associationOptions: SelectLabel[],
  associationUserLabels: SelectLabel[],
  canChooseApplicant: boolean
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
    <div
      :aria-label="t('project.applicant')"
      class="flex-column"
      role="group"
    >
      <QBtn
        :aria-pressed="applicant === 'association'"
        :disable="!canChooseApplicant"
        :icon="applicant === 'association' ? 'bi-check2' : 'bi-people'"
        :label="t('project.deposit-for-association')"
        :outline="applicant !== 'association'"
        class="btn-lg full-width"
        color="commission"
        type="button"
        @click="applicant = 'association'"
      />
      <QBtn
        :aria-pressed="applicant === 'user'"
        :disable="!canChooseApplicant"
        :icon="applicant === 'user' ? 'bi-check2' : 'bi-person'"
        :label="t('project.deposit-as-individual')"
        :outline="applicant !== 'user'"
        class="btn-lg full-width"
        color="commission"
        type="button"
        @click="applicant = 'user'"
      />
    </div>

    <template v-if="applicant !== null">
      <InfoFormRequiredFields/>

      <template v-if="applicant === 'association'">
        <div
          v-if="!associationOptions.length"
          class="info-panel info-panel-warning"
        >
          <i
            aria-hidden="true"
            class="bi bi-info-circle"
          ></i>
          <p>{{ t('project.no-association-to-submit') }}</p>
        </div>
        <QSelect
          v-else
          v-model="associationId"
          :disable="!canChooseApplicant"
          :label="t('project.concerned-association') + ' *'"
          :options="associationOptions"
          :rules="[val => val !== null || t('forms.required-project-association')]"
          aria-required="true"
          clearable
          color="commission"
          emit-value
          filled
          lazy-rules
          map-options
        />
        <QSelect
          v-if="associationId !== null"
          v-model="projectInfos.associationUser"
          :disable="!canChooseApplicant"
          :label="t('project.association-user') + ' *'"
          :options="associationUserLabels"
          :rules="[val => val !== null || t('forms.required-project-association-user')]"
          aria-required="true"
          clearable
          color="commission"
          emit-value
          filled
          lazy-rules
          map-options
        />
      </template>

      <QInput
        v-model="projectInfos.name"
        :disable="!props.canChooseApplicant"
        :label="t('project.name') + ' *'"
        :rules="[val => val && val.length > 0 || t('forms.required-project-name'),
                 val => val && val.length < 100 || t('forms.project-name-under-100')]"
        aria-required="true"
        clearable
        color="commission"
        filled
        lazy-rules
      />
    </template>

    <div class="flex-row-center padding-top padding-bottom">
      <QBtn
        :disable="!projectInfos.name
          || (applicant === 'association'
            && (associationId === null
              || !props.associationOptions.length
              || projectInfos.associationUser === null))"
        :label="t('continue')"
        class="btn-lg"
        color="commission"
        icon="bi-check2"
        type="submit"
      />
    </div>
  </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";
</style>
