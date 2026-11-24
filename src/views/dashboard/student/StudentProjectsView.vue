<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {usePermission} from '@/composables/usePermission'
import ProjectListTable from '@/components/project/projectList/ProjectListTable.vue'

const {t} = useI18n()
const {hasPerm} = usePermission()
</script>

<template>
  <div class="section">
    <div class="container-lg">
      <section>
        <div
          v-if="hasPerm('add_project_user') || hasPerm('add_project_association')"
          class="flex-row-center padding-bottom"
        >
          <QBtn
            :label="t('project.submit-new-project')"
            :to="{name: 'SubmitProject'}"
            class="btn-lg"
            color="commission"
            icon="bi-plus-circle"
          />
        </div>
        <ProjectListTable />
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';

.section {
  background-color: #f5f5f5;
}

.container-lg {
  padding: 1rem;
}
</style>
