<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import type {UpdateCommission} from '#/commission'
import type {SelectLabel} from '#/global'
import AlertConfirmCommissionDateUpdateOrDelete from '@/components/alert/AlertConfirmCommissionDateUpdateOrDelete.vue'
import useUtil from '@/composables/useUtil'

const {t} = useI18n()
const {fromDateIsAnterior} = useUtil()

defineProps<{
  commissions: UpdateCommission[],
  fundsLabels: SelectLabel[]
}>()

const emit = defineEmits<{
  datesChange: [commission: UpdateCommission],
  updateCommissionDate: [commission: UpdateCommission],
  deleteCommissionDate: [commissionId: number]
}>()
</script>

<template>
  <div class="dashboard-section">
    <h2>
      <i
        aria-hidden="true"
        class="bi bi-calendar-check"
      ></i>
      {{ t('commission.ongoing-or-to-come') }}
    </h2>
    <div class="dashboard-section-container">
      <div class="container">
        <div
          v-for="commission in commissions"
          :key="commission.id"
          class="document-input-group"
        >
          <div class="document-input variant-space-1">
            <div class="document-input-header">
              <h4>
                {{ commission.oldName }}
              </h4>

              <p class="form-state form-state-cape">
                <span
                  v-if="commission.oldIsOpenToProjects"
                  :aria-label="t('commission.is-open-to-projects')"
                  class="form-state-icon form-state-green"
                ><i class="bi bi-check"></i></span>
                <span
                  v-else
                  :aria-label="t('commission.is-closed-to-projects')"
                  class="form-state-icon form-state-red"
                ><i class="bi bi-x"></i></span>
              </p>

              <button
                :aria-label="t('modify')"
                type="button"
                @click.prevent="commission.open = !commission.open"
              >
                <i
                  :class="`bi bi-${commission.open ? 'x' : 'pencil'}`"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </div>

          <div v-if="commission.open">
            <QForm>
              <QInput
                v-model="commission.newName"
                :label="t('commission.name')"
                :rules="[val => val && val.length > 0 || t('forms.required-commission-name')]"
                clearable
                color="commission"
                filled
                lazy-rules
              />
              <QInput
                v-model="commission.newCommissionDate"
                :label="t('commission.date')"
                :rules="[
                  val => val && val.length > 0 || t('forms.required-commission-date'),
                  val => val && fromDateIsAnterior(commission.newSubmissionDate, commission.newCommissionDate, true)
                    || t('forms.commission-date-must-be-posterior-to-submission-date')
                ]"
                clearable
                color="commission"
                filled
                max="2120-01-01"
                min="1970-01-01"
                reactive-rules
                type="date"
                @update:model-value="emit('datesChange', commission)"
              />
              <QInput
                v-model="commission.newSubmissionDate"
                :label="t('commission.submission')"
                :rules="[
                  val => val && val.length > 0 || t('forms.required-commission-submission-date'),
                  val => val && fromDateIsAnterior(commission.newSubmissionDate, commission.newCommissionDate, true)
                    || t('forms.commission-date-must-be-posterior-to-submission-date')
                ]"
                clearable
                color="commission"
                filled
                max="2120-01-01"
                min="1970-01-01"
                reactive-rules
                type="date"
                @update:model-value="emit('datesChange', commission)"
              />
              <QSelect
                v-model="commission.newFunds"
                :label="t('commission.funds')"
                :options="fundsLabels"
                :rules="[val => val && val.length > 0 || t('forms.required-commission-funds')]"
                clearable
                color="commission"
                emit-value
                filled
                map-options
                multiple
                use-chips
              />
              <QToggle
                v-model="commission.newIsOpenToProjects"
                :label="t('commission.is-open-to-projects')"
                color="commission"
              />
              <AlertConfirmCommissionDateUpdateOrDelete
                :commission="commission"
                @update-commission-date="emit('updateCommissionDate', commission)"
                @delete-commission-date="emit('deleteCommissionDate', commission.id)"
              />
            </QForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard";
@import "@/assets/styles/forms";
</style>
