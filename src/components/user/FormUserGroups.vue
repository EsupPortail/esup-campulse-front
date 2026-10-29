<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroup'
import {useI18n} from 'vue-i18n'
import {onMounted, onUnmounted, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import axios from 'axios'
import useErrors from '@/composables/useError'
import {useProfileStore} from '@/stores/useProfileStore'
import {useUserStore} from '@/stores/useUserStore'
import {useFundStore} from '@/stores/useFundStore'
import {useGroupStore} from '@/stores/useGroupStore'


const {t} = useI18n()
const profileStore = useProfileStore()
const userStore = useUserStore()
const fundStore = useFundStore()
const groupStore = useGroupStore()
const {
  groupChoiceIsValid,
  newGroups,
  selectGroup,
  commissionMemberGroupIsSelected,
  userFunds,
  initGroupLabels,
  groupLabels
} = useUserGroups()
const {notify, loading} = useQuasar()
const route = useRoute()
const {catchHTTPError} = useErrors()

async function onGetGroups() {
  try {
    await groupStore.getGroups()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

async function onGetFunds() {
  try {
    await fundStore.getFunds()
    const editedByStaff: boolean = route.name === 'AddUser'
    userFunds.value = editedByStaff ? [...userStore.userFunds] : [...profileStore.userFunds]
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

watch(() => commissionMemberGroupIsSelected.value, async () => {
  loading.show()
  await onGetFunds()
  loading.hide()
})

function onInitGroupLabels() {
  const isRegistration: boolean = (route.name === 'Registration') || (route.name === 'AddUser') || (route.name === 'CASRegistration')
  initGroupLabels(isRegistration)
  if (isRegistration) selectGroup('STUDENT_INSTITUTION')
}

onMounted(async () => {
  loading.show()
  await onGetGroups()
  onInitGroupLabels()
  if (commissionMemberGroupIsSelected.value) {
    await onGetFunds()
  }
  loading.hide()
})

onUnmounted(() => {
  newGroups.value = []
})

</script>

<template>
  <QField
    v-if="groupStore.groups"
    :error="!groupChoiceIsValid"
    :error-message="t('forms.required-status')"
    borderless
    color="base"
  >
    <QOptionGroup
      v-model="newGroups"
      :aria-label="t('forms.group-role')"
      :options="groupLabels"
      color="dashboard"
      type="checkbox"
    />
  </QField>
  <QSelect
    v-if="commissionMemberGroupIsSelected"
    v-model="userFunds"
    :label="t('commission.commission', 2)"
    :options="fundStore.fundLabels"
    :rules="[val => val.length >= 1 || t('forms.required-commission')]"
    color="dashboard"
    emit-value
    filled
    map-options
    multiple
    style="width: 250px"
    use-chips
  />
</template>

<style lang="scss" scoped>
@import '@/assets/_variables';
</style>
