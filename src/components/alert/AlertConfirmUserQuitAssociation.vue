<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useErrors from '@/composables/useError'
import axios from 'axios'
import useUserAssociation from '@/composables/useUserAssociation'

const {t} = useI18n()
const confirmation = ref<boolean>(false)
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {deleteUserAssociation} = useUserAssociation()

const associationStore = useAssociationStore()

const emit = defineEmits(['userAssociationDeleted'])

const props = defineProps<{
  editedByManager: boolean
  associationId: number | null,
  userId: number | null,
}>()

async function onDeleteUserAssociation() {
  loading.show()
  try {
    await deleteUserAssociation(props.userId, props.associationId)
    emit('userAssociationDeleted')
    const filters = {
      allowNewUsers: true,
    }
    await associationStore.getAssociationNames(filters)
    notify({
      type: 'positive',
      message: t('notifications.positive.validate-delete-user-association')
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
  loading.hide()
}

</script>

<template>
  <QBtn
    :aria-label="t(`dashboard.association-user.delete-association${!editedByManager ? '-self' : ''}`)"
    class="btn-lg"
    color="custom-red"
    icon="bi-trash"
    outline
    @click="confirmation = true"
  />

  <QDialog
    v-model="confirmation"
    persistent
  >
    <QCard>
      <QCardSection class="row items-center">
        <p class="q-ml-sm">
          {{ t(`dashboard.association-user.confirm-delete${!editedByManager ? '-self' : ''}`) }}
        </p>
        <div class="flex-row padding-top">
          <QBtn
            v-close-popup
            :label="t('cancel')"
            class="btn-lg"
            color="dashboard"
            icon="bi-x-lg"
          />
          <QBtn
            v-close-popup
            :label="t(`dashboard.association-user.delete-association${!editedByManager ? '-self' : ''}`)"
            class="btn-lg"
            color="custom-red"
            icon="bi-trash"
            @click="onDeleteUserAssociation"
          />
        </div>
      </QCardSection>
    </QCard>
  </QDialog>
</template>
