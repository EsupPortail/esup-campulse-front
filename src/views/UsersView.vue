<script lang="ts" setup>
import {useUsersStore} from '@/stores/useUsersStore'
import {onMounted} from 'vue'
import router from '@/router'
import type {QTableProps} from 'quasar'

const usersStore = useUsersStore()
onMounted(usersStore.getUsers)


const columns: QTableProps['columns'] = [
    {
        name: 'firstName',
        required: true,
        label: 'Nom de famille',
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    {name: 'lastName', align: 'left', label: 'Prénom', field: 'lastName', sortable: true},
    {name: 'email', align: 'left', label: 'Adresse mail', field: 'email', sortable: true},
    {name: 'isValidatedByAdmin', align: 'left', label: 'Est validé', field: 'isValidatedByAdmin', sortable: true},
]

function goTo(id: number) {
    router.push({name: 'UserDetail', params: {id}})
}
</script>

<template>
    <h1>{{ $t("manager.users") }}</h1>
    <QTable
        :columns="columns"
        :rows="usersStore.userDirectory"
        row-key="firstName"
        title="Users"
    >
        <template v-slot:body="props">
            <QTr :props="props" @click="goTo(props.row.id)">
                <QTd key="firstName" :props="props">
                    {{ props.row.firstName }}
                </QTd>
                <QTd key="lastName" :props="props">
                    {{ props.row.lastName }}
                </QTd>
                <QTd key="email" :props="props">
                    {{ props.row.email }}
                </QTd>
                <QTd key="isValidatedByAdmin" :props="props">
                    {{ props.row.isValidatedByAdmin }}
                </QTd>
            </QTr>
        </template>
    </QTable>
</template>

<style lang="sass" scoped>
.q-tr:hover
    cursor: pointer
</style>

