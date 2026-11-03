<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {onMounted} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroup'
import useErrors from '@/composables/useError'
import axios from 'axios'
import FormUserSearch from '@/components/user/FormUserSearch.vue'
import {usePermission} from '@/composables/usePermission'
import type {UserGroup} from '#/user'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const {canEditUser, hasPerm} = usePermission()
const route = useRoute()
const {groupFriendlyName} = useUserGroups()
const {catchHTTPError} = useErrors()


async function onGetUsers() {
  try {
    if (!hasPerm('view_user')) return
    await userStore.getUsers(route.name === 'ValidateUsers' ? {isValidatedByAdmin: false} : undefined)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

onMounted(async () => {
  loading.show()
  await onGetUsers()
  loading.hide()
})

const columns: QTableProps['columns'] = [
  {name: 'firstName', align: 'left', label: t('forms.first-name'), field: 'firstName', sortable: true},
  {name: 'lastName', align: 'left', label: t('forms.last-name'), field: 'lastName', sortable: true},
  {name: 'email', align: 'left', label: t('forms.email'), field: 'email', sortable: true},
  {
    name: 'associations',
    align: 'center',
    label: t('directory.title'),
    field: 'associations'
  },
  {name: 'groups', align: 'center', label: t('user.groups'), field: 'groups', sortable: false},
  {
    name: 'isValidatedByAdmin',
    align: 'right',
    label: t('account'),
    field: 'isValidatedByAdmin',
    sortable: true
  },
  {
    name: 'edition',
    align: 'left',
    label: t('consult'),
    field: 'edition',
    sortable: false
  }
]

const uniqueGroups = (userGroups: UserGroup[]): UserGroup[] => {
  const groupIds: number[] = []
  const result: UserGroup[] = []
  userGroups.forEach(item => {
    const groupId = item.groupId
    if (groupIds.includes(groupId)) return
    result.push(item)
    groupIds.push(item.groupId)
  })
  return result
}

</script>

<template>
  <section class="dashboard-section">
    <h2>
      <i
        aria-hidden="true"
        class="bi bi-pencil-square"
      ></i>
      {{ route.name === 'ValidateUsers' ? t('user-manager.validation') : t('user-manager.management') }}
    </h2>

    <div class="dashboard-section-container">
      <div class="container-lg">
        <FormUserSearch
          :route-name="route.name as string"
          @get-users="onGetUsers"
        />

        <QTable
          :columns="columns"
          :loading="!userStore.users"
          :rows="userStore.users"
          :rows-per-page-options="[10, 20, 50, 0]"
          :title="t('user-manager.users')"
          role="presentation"
          row-key="id"
          wrap-cells
        >
          <template v-slot:header="props">
            <QTr :props="props">
              <QTh
                v-for="col in props.cols"
                :id="col.name"
                :key="col.name"
                :props="props"
                scope="col"
              >
                {{ col.label }}
              </QTh>
            </QTr>
          </template>
          <template v-slot:body="props">
            <QTr :props="props">
              <QTd
                key="firstName"
                :props="props"
                headers="firstName"
              >
                {{ props.row.firstName }}
              </QTd>
              <QTd
                key="lastName"
                :props="props"
                headers="lastName"
              >
                {{ props.row.lastName }}
              </QTd>
              <QTd
                key="email"
                :props="props"
                headers="email"
              >
                {{ props.row.email }}
              </QTd>
              <QTd
                key="associations"
                :props="props"
                headers="associations"
              >
                <ul>
                  <li
                    v-for="(association, index) in props.row.associations"
                    :key="`user-association-${index}`"
                  >
                    <QChip>{{ association.acronym ?? (association.name.slice(0, 20).trim() + '...') }}</QChip>
                  </li>
                </ul>
              </QTd>
              <QTd
                key="groups"
                :props="props"
                headers="groups"
              >
                <ul>
                  <li
                    v-for="(group, index) in uniqueGroups(props.row.groups)"
                    :key="`user-group-${index}`"
                  >
                    <QChip>
                      {{
                        groupFriendlyName(group.groupId)
                      }}
                    </QChip>
                  </li>
                </ul>
              </QTd>
              <QTd
                key="isValidatedByAdmin"
                :props="props"
                headers="isValidatedByAdmin"
              >
                <span class="form-state">
                  {{
                    props.row.isValidatedByAdmin ? t('validated') : t('validated-non')
                  }}

                  <span
                    :class="props.row.isValidatedByAdmin ? 'form-state-icon form-state-green' : 'form-state-icon form-state-red'"
                    aria-hidden="true"
                  >
                    <i :class="props.row.isValidatedByAdmin ? 'bi bi-check' : 'bi bi-x'"></i>
                  </span>
                </span>
              </QTd>
              <QTd
                key="edition"
                :props="props"
                class="actions-cell-compact"
                headers="edition"
              >
                <div class="dashboard-btn-group">
                  <QBtn
                    v-if="route.name === 'ManageUsers' && canEditUser(props.row.groups)"
                    :aria-label="t('modify')"
                    :to="{ name: 'UserManagementDetail', params: { id: props.row.id } }"
                    color="dashboard"
                    icon="bi-pencil"
                    outline
                  />
                  <QBtn
                    v-if="route.name === 'ValidateUsers'"
                    :aria-label="t('consult')"
                    :to="{ name: 'UserValidationDetail', params: { id: props.row.id } }"
                    color="dashboard"
                    icon="bi-eye"
                    outline
                  />
                </div>
              </QTd>
            </QTr>
          </template>
        </QTable>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard';
@import '@/assets/styles/forms';
@import '@/assets/_variables';

ul {
  padding-left: 0;
}

ul > li {
  list-style: none;
}
</style>
