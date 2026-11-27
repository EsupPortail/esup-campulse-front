<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import FormDocumentUpload from '@/components/documents/FormDocumentUpload.vue'

const {t} = useI18n()

defineProps<{
  associationId: number | null
}>()

const emit = defineEmits<{
  submit: [],
  back: []
}>()
</script>

<template>
  <QForm @submit.prevent="emit('submit')">
    <div class="info-panel info-panel-warning ">
      <i
        aria-hidden="true"
        class="bi bi-exclamation"
      ></i>
      <p>{{ t('project.sign-charter') }}</p>
    </div>

    <FormDocumentUpload
      :association-id="associationId"
      process="project"
    />

    <div class="flex-row-center padding-top padding-bottom">
      <QBtn
        :label="t('back')"
        class="btn-lg"
        color="commission"
        icon="bi-chevron-left"
        @click="emit('back')"
      />
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

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
</style>
