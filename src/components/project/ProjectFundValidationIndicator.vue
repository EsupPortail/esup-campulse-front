<script lang="ts" setup>
import type {ProjectCommissionFund} from '#/project'
import useUtil from '@/composables/useUtil'
import {useI18n} from 'vue-i18n'

defineProps<{
  projectCommissionFunds: ProjectCommissionFund[]
}>()

const {t} = useI18n()
const {CURRENCY} = useUtil()

const itemKey = crypto.randomUUID()
</script>

<template>
  <ul v-if="projectCommissionFunds.length">
    <li
      v-for="item in projectCommissionFunds"
      :key="`${itemKey}-${item.pk}`"
    >
      {{ item.commissionFund.fund.acronym }}
      <span
        v-if="item.isValidatedByAdmin"
        class="form-state form-state-cape"
      >
        <span
          v-if="item.amountEarned === 0"
          class="form-state-icon form-state-red"
        >
          <i
            :aria-label="t('rejected')"
            class="bi bi-x"
          ></i>
        </span>
        <span
          v-else
          class="form-state-icon form-state-green"
        >
          <i
            :aria-label="t('validated')"
            class="bi bi-check"
          ></i>
        </span>
        <span v-if="item.amountEarned || item.amountEarned === 0">
          {{ ` (${item.amountEarned} ${CURRENCY})` }}
        </span>
      </span>
      <span
        v-if="item.isValidatedByAdmin === false"
        class="form-state form-state-cape"
      >
        <span
          class="form-state-icon form-state-red"
        >
          <i
            :aria-label="t('rejected')"
            class="bi bi-x"
          ></i>
        </span>
      </span>
      <span
        v-if="item.isValidatedByAdmin === null"
        class="form-state form-state-cape"
      >
        <span
          class="form-state-icon form-state-grey"
        >
          <i
            :aria-label="t('validation-pending')"
            class="bi bi-dash"
          ></i>
        </span>
      </span>
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

ul {
  padding-left: 0;
}

li {
  list-style: none;
  white-space: nowrap;
}
</style>
