<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

defineProps<{
  openModal: boolean,
  message: string,
  buttonColor: string,
  validateButtonColor?: string,
  validateButtonLabel?: string,
  validateButtonIcon?: string,
}>()

const emit = defineEmits<{
  (_e: 'update:open-modal', _value: boolean): void,
  (_e: 'confirm-action'): void
}>()

function confirmAction(confirm: boolean) {
  // Close modal
  emit('update:open-modal', false)
  // If needed, confirm action
  if (confirm) {
    emit('confirm-action')
  }
}

</script>

<template>
  <QDialog
    :model-value="openModal"
    no-backdrop-dismiss
    no-esc-dismiss
    @update:model-value="emit('update:open-modal', $event)"
  >
    <QCard>
      <QCardSection>
        <p>{{ message }}</p>
        <div class="btn-group">
          <QBtn
            :color="validateButtonColor ?? buttonColor"
            :label="t('cancel')"
            class="btn-lg"
            icon="bi-x-lg"
            @click="confirmAction(false)"
          />
          <QBtn
            :color="validateButtonColor ?? buttonColor"
            :icon="validateButtonIcon ?? 'bi-check-lg'"
            :label="validateButtonLabel ?? t('validate')"
            class="btn-lg"
            @click="confirmAction(true)"
          />
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<style lang="scss" scoped>
.btn-group {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
}
</style>
