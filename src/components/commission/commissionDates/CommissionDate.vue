<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import type {UpdateCommission} from '#/commission'
import AlertConfirmCommissionDateUpdateOrDelete from '@/components/alert/AlertConfirmCommissionDateUpdateOrDelete.vue'
import useCommissionDate from '@/composables/useCommissionDate'
import useUtil from '@/composables/useUtil'
import {useFundStore} from '@/stores/useFundStore'

const {t} = useI18n()
const {fromDateIsAnterior} = useUtil()
const fundStore = useFundStore()
const {canUpdateCommission, checkCommissionDates, onUpdateCommission, onDeleteCommission} = useCommissionDate()

const commission = defineModel<UpdateCommission>({required: true})

const canUpdate = computed<boolean>(() => canUpdateCommission(commission.value))
const openInfos = ref<boolean>(false)
</script>

<template>
  <div class="document-input-group">
    <div class="document-input variant-space-1">
      <div class="document-input-header">
        <h4>
          {{ commission.name }}
        </h4>

        <p class="form-state form-state-cape">
          <span
            v-if="commission.isOpenToProjects"
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
          v-model="commission.name"
          :label="t('commission.name')"
          :rules="[val => val && val.length > 0 || t('forms.required-commission-name')]"
          clearable
          color="commission"
          filled
          lazy-rules
        />
        <QInput
          v-model="commission.commissionDate"
          :label="t('commission.date')"
          :rules="[
            val => val && val.length > 0 || t('forms.required-commission-date'),
            val => val && fromDateIsAnterior(commission.submissionDate, commission.commissionDate, true)
              || t('forms.commission-date-must-be-posterior-to-submission-date')
          ]"
          clearable
          color="commission"
          filled
          max="2120-01-01"
          min="1970-01-01"
          reactive-rules
          type="date"
          @update:model-value="checkCommissionDates(commission)"
        />
        <QInput
          v-model="commission.submissionDate"
          :label="t('commission.submission')"
          :rules="[
            val => val && val.length > 0 || t('forms.required-commission-submission-date'),
            val => val && fromDateIsAnterior(commission.submissionDate, commission.commissionDate, true)
              || t('forms.commission-date-must-be-posterior-to-submission-date')
          ]"
          clearable
          color="commission"
          filled
          max="2120-01-01"
          min="1970-01-01"
          reactive-rules
          type="date"
          @update:model-value="checkCommissionDates(commission)"
        />
        <QInput
          v-model="commission.editionDate"
          :label="t('commission.edition-date')"
          :rules="[
            val => val && val.length > 0 || t('forms.required-commission-edition-date'),
            () => commission.editionDateIsLegal
              || t('forms.commission-edition-date-must-be-between-submission-and-commission-dates')
          ]"
          clearable
          color="commission"
          filled
          max="2120-01-01"
          min="1970-01-01"
          reactive-rules
          type="date"
          @update:model-value="checkCommissionDates(commission)"
        />
        <QSelect
          v-model="commission.funds"
          :label="t('commission.funds')"
          :options="fundStore.fundLabels"
          :rules="[val => val && val.length > 0 || t('forms.required-commission-funds')]"
          clearable
          color="commission"
          emit-value
          filled
          map-options
          multiple
          use-chips
        />
        <div>
          <QToggle
            v-model="commission.isOpenToProjects"
            :label="t('commission.is-open-to-projects')"
            color="commission"
          />
        </div>
        <div>
          <QToggle
            v-model="openInfos"
            :label="t('commission.informations')"
            color="commission"
          />
        </div>
        <div
          v-if="openInfos"
          class="flex-column gap-m padding-top"
        >
          <QInput
            v-model="commission.scheduledTime"
            :label="t('commission.scheduled-time')"
            clearable
            color="commission"
            filled
            type="time"
          />
          <QInput
            v-model="commission.building"
            :label="t('commission.building')"
            clearable
            color="commission"
            filled
          />
          <QInput
            v-model="commission.room"
            :label="t('commission.room')"
            clearable
            color="commission"
            filled
          />
          <QInput
            v-model="commission.address"
            :label="t('commission.address')"
            clearable
            color="commission"
            filled
          />
        </div>
        <AlertConfirmCommissionDateUpdateOrDelete
          :can-update="canUpdate"
          :commission-id="commission.id"
          @update-commission-date="onUpdateCommission(commission)"
          @delete-commission-date="onDeleteCommission"
        />
      </QForm>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard";
@import "@/assets/styles/forms";
</style>
