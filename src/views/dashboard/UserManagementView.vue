<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroups'
import type {User, UserGroup} from '#/user'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import FormUserSearch from '@/components/form/FormUserSearch.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const {canEditUser} = useUsers()
const route = useRoute()
const {getGroups, getGroupLiteral} = useUserGroups()
const {catchHTTPError} = useErrors()

const users = ref<User[]>([])

watch(() => userManagerStore.users, () => {
    users.value = userManagerStore.users
})

onMounted(async () => {
    loading.show()
    await onGetUsers()
    await onGetUserGroups()
    loading.hide()
})

async function onGetUsers() {
    try {
        let status = 'all'
        if (route.name === 'ValidateUsers') status = 'unvalidated'
        await userManagerStore.getUsers(status)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetUserGroups() {
    try {
        await getGroups()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

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
        label: t('edit'),
        field: 'edition',
        sortable: false
    }
]

</script>

<template>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            {{ route.name === 'ValidateUsers' ? t("user-manager.validation") : t("user-manager.management") }}
        </h2>
        <div class="form-container">
            <div class="form">
                <FormUserSearch
                    @advanced-search="(result) => users = result"
                    @get-users="onGetUsers"
                />
                <QTable
                    :columns="columns"
                    :loading="!users"
                    :rows="users"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    :title="t('user-manager.users')"
                    row-key="id"
                >
                    <template v-slot:body="props">
                        <QTr :props="props">
                            <QTd
                                key="firstName"
                                :props="props"
                            >
                                {{ props.row.firstName }}
                            </QTd>
                            <QTd
                                key="lastName"
                                :props="props"
                            >
                                {{ props.row.lastName }}
                            </QTd>
                            <QTd
                                key="email"
                                :props="props"
                            >
                                {{ props.row.email }}
                            </QTd>
                            <QTd
                                key="associations"
                                :props="props"
                            >
                                <ul>
                                    <li
                                        v-for="(association, index) in props.row.associations"
                                        :key="index"
                                    >
                                        <QChip>{{ association.name }}</QChip>
                                    </li>
                                </ul>
                            </QTd>
                            <QTd
                                key="groups"
                                :props="props"
                            >
                                <ul>
                                    <li
                                        v-for="(group, index) in props.row.groups"
                                        :key="index"
                                    >
                                        <QChip
                                            v-if="props.row.groups.map((g: UserGroup) => g.groupId).indexOf(group.groupId) === index"
                                        >
                                            {{
                                                getGroupLiteral(group.groupId)
                                            }}
                                        </QChip>
                                    </li>
                                </ul>
                            </QTd>
                            <QTd
                                key="isValidatedByAdmin"
                                :props="props"
                            >
                                <span class="form-state">
                                    {{
                                        props.row.isValidatedByAdmin ? t('validated') : t('validated-non')
                                    }}

                                    <span
                                        :class="props.row.isValidatedByAdmin ? 'form-state-icon form-state-green' : 'form-state-icon form-state-red'"
                                    >
                                        <i :class="props.row.isValidatedByAdmin ? 'bi bi-check' : 'bi bi-x'"></i>
                                    </span>
                                </span>
                            </QTd>
                            <QTd
                                key="edition"
                                :props="props"
                                class="actions-cell-compact"
                            >
                                <div class="button-container">
                                    <QBtn
                                        v-if="route.name === 'ManageUsers' && canEditUser(props.row.groups)"
                                        :to="{name: 'UserManagementDetail', params: {id: props.row.id}}"
                                        icon="bi-pencil"
                                    />
                                    <QBtn
                                        v-if="route.name === 'ValidateUsers'"
                                        :label="t('consult')"
                                        :to="{name: 'UserValidationDetail', params: {id: props.row.id}}"
                                        color="secondary"
                                        icon="mdi-check-circle"
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

<style lang="scss">
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

li {
    list-style: none;
}

.q-table {
    width: $fullSize;
}

.form {
    width: auto;
}
</style>
