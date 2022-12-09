<script lang="ts" setup>
import {useUsersStore} from '@/stores/useUsersStore'
import {onMounted} from 'vue'
import type {QTableProps} from 'quasar'
import router from '@/router'
//import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
//import type {UserValidate} from '#/user'

const {t} = useI18n()
const {notify} = useQuasar()
const usersStore = useUsersStore()
onMounted(usersStore.getUsers)


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
    {name: 'firstName', align: 'left', label: 'Nom de famille', field: 'firstName', sortable: true},
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
        row-key="id"
        title="Users"
    >
        <template v-slot:body="props">
            <QTr :props="props" @click="goTo(props.row.id)">
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
                <QTd key="isValidatedByAdmin" :props="props">
                  {{ props.row.isValidatedByAdmin ? "Oui" : "Non" }}
                </QTd>
                <!--
                <QTd key="isValidatedByAdmin" :props="props">
                    <QCheckbox
                        v-model="props.row.isValidatedByAdmin"
                        :label="$t('forms.validated-account')"
                    />
                </QTd>
              -->
            </QTr>
        </template>
    </QTable>
</template>

<style lang="sass" scoped>
.q-tr:hover
    cursor: pointer
</style>

