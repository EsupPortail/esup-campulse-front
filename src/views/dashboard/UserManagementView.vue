<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import router from '@/router'
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import useUserGroups from "@/composables/useUserGroups";
import type {User, UserGroup} from "#/user";

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const {getUsers} = useUsers()
const route = useRoute()
const {getGroups, getGroupLiteral, groups} = useUserGroups()

const users = ref<User[]>([])

watch(() => userManagerStore.users, () => {
    users.value = userManagerStore.users
})

onMounted(async () => {
    loading.show
    await onGetUsers()
    await onGetUserGroups()
    loading.hide
})

async function onGetUsers() {
    try {
        await getUsers(route.name as string)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetUserGroups() {
    try {
        await getGroups()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

const columns: QTableProps['columns'] = [
    {
        name: 'id',
        required: true,
        label: 'ID',
        align: 'left',
        field: row => row.id,
        format: val => `${val}`,
        sortable: true
    },
    {name: 'firstName', align: 'left', label: t('forms.first-name'), field: 'firstName', sortable: true},
    {name: 'lastName', align: 'left', label: t('forms.last-name'), field: 'lastName', sortable: true},
    {name: 'email', align: 'left', label: t('forms.email'), field: 'email', sortable: true},
    {
        name: 'associations',
        align: 'left',
        label: t('directory.title'),
        field: 'associations',
        sortable: false
    },
    {name: 'groups', align: 'left', label: t('user-manager.user-status'), field: 'groups', sortable: false},
    {
        name: 'isValidatedByAdmin',
        align: 'left',
        label: t('user-manager.is-validated'),
        field: 'isValidatedByAdmin',
        sortable: true
    }
]

function goTo(row: User) {
    let enableUserDetail = true
    for (let i = 0; i < (row.groups?.length as number); i++) {
        const g = groups.value?.find(obj => obj.id === (row.groups?.[i] as UserGroup).groupId)
        if (g && !g.isPublic) {
            enableUserDetail = false
            break
        }
    }
    if (enableUserDetail) {
        if (route.name === 'ValidateUsers') {
            router.push({name: 'UserValidationDetail', params: {id: row.id}})
        } else {
            router.push({name: 'UserManagementDetail', params: {id: row.id}})
        }
    }
}
</script>

<template>
    <h1>{{ route.name === 'ValidateUsers' ? t("user-manager.validation") : t("user-manager.management") }}</h1>
    <QTable
        :columns="columns"
        :rows="users"
        :rows-per-page-options="[10, 20, 50, 0]"
        :title="t('user-manager.users')"
        row-key="id"
    >
        <template v-slot:body="props">
            <QTr :props="props" @click="goTo(props.row)">
                <QTd key="id" :props="props">
                    {{ props.row.id }}
                </QTd>
                <QTd key="firstName" :props="props">
                    {{ props.row.firstName }}
                </QTd>
                <QTd key="lastName" :props="props">
                    {{ props.row.lastName }}
                </QTd>
                <QTd key="email" :props="props">
                    {{ props.row.email }}
                </QTd>
                <QTd key="associations" :props="props">
                    <ul>
                        <li v-for="(association, index) in props.row.associations" :key="index">
                            <QChip>{{ association.name }}</QChip>
                        </li>
                    </ul>
                </QTd>
                <QTd key="groups" :props="props">
                    <ul>
                        <li v-for="(group, index) in props.row.groups" :key="index">
                            <QChip v-if="props.row.groups.map(g => g.groupId).indexOf(group.groupId) === index">{{ getGroupLiteral(group.groupId) }}</QChip>
                        </li>
                    </ul>
                </QTd>
                <QTd key="isValidatedByAdmin" :props="props">
                    <QChip :color="props.row.isValidatedByAdmin ? 'teal' : 'red'" text-color="white">
                        {{ props.row.isValidatedByAdmin ? t('yes') : t('no') }}
                    </QChip>
                </QTd>
            </QTr>
        </template>
    </QTable>
</template>

<style lang="sass" scoped>
.q-tr:hover
    cursor: pointer

ul
    margin-left: -40px

    li
        list-style: none
</style>

