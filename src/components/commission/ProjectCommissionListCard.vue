<script lang="ts" setup>
import type {Commission} from '#/commission'
import GlobalDefinition from '@/components/global/GlobalDefinition.vue'
import useUtil from '@/composables/useUtil'
import GlobalBooleanIcon from '@/components/global/GlobalBooleanIcon.vue'
import {useI18n} from 'vue-i18n'

const {reverseDate, formatDate} = useUtil()
const {t} = useI18n()

defineProps<{
  commission: Commission,
  headingLevel: number,
  archived?: boolean,
}>()
</script>

<template>
  <div class="display-row">
    <div class="grid-container">
      <div class="grid-content">
        <div class="flex-row">
          <p
            :aria-level="headingLevel"
            class="row-title"
            role="heading"
          >
            {{ commission.name }}
          </p>
          <GlobalBooleanIcon
            :ariaLabelFalse="t('commission.is-closed-to-projects')"
            :ariaLabelTrue="t('commission.is-open-to-projects')"
            :state="commission.isOpenToProjects"
          />
        </div>
        <dl class="flex-row-space-between">
          <GlobalDefinition :title="t('commission.date')">
            {{ reverseDate(commission.commissionDate) }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.submission-date')">
            {{ reverseDate(commission.submissionDate) }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('edition-date')">
            {{ reverseDate(formatDate(commission.editionDate)) }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.funds')">
            <div class="flex-row">
              <QChip
                v-for="item in commission.funds.map(item => item.acronym)"
                :key="`commission-${commission.id}-fund-${item}`"
                color="commission"
                outline
                size="sm"
              >
                {{ item }}
              </QChip>
            </div>
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.submitted-projects-count')">
            {{ commission.submittedProjectsCount ?? 0 }}
          </GlobalDefinition>
          <GlobalDefinition :title="t('commission.overdue-reviews-count')">
            {{ commission.overdueReviewCount ?? 0 }}
          </GlobalDefinition>
        </dl>
      </div>
      <QBtn
        v-if="commission.submittedProjectsCount"
        :title="t('view.projects')"
        :to="{name: `${archived ? 'Archived' : ''}CommissionProjects`, params: {commissionId: commission.id}}"
        flat
        icon="bi-arrow-right"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

p[role="heading"] {
  font-weight: $semibold-weight !important;
}

.q-chip {
  margin: 0.5rem 0;
}

.grid-container {
  display: grid;
  grid-template-columns: auto 8rem;
  grid-gap: 2rem;
}

.grid-content {
  display: grid;
  grid-gap: 0.5rem;

  dl {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 2fr 1fr 1fr;
    grid-gap: 1rem;
  }
}
</style>