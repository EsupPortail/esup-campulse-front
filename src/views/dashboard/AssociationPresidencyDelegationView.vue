<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import FormAssociationPresidencyDelegation from '@/components/form/FormAssociationPresidencyDelegation.vue'
import useUserAssociations from '@/composables/useUserAssociations'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useUserStore} from '@/stores/useUserStore'
import router from '@/router'
import InfoPresidencyDelegation from '@/components/infoPanel/InfoPresidencyDelegation.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const route = useRoute()
const {initAssociationMembers, associationMembers} = useUserAssociations()
const {catchHTTPError} = useErrors()
const userStore = useUserStore()

onMounted(async () => {
    loading.show()
    await onGetAssociationUsers()
    if (isAuthorized()) {
        initAssociationName()
    } else {
        await router.push({name: '404'})
    }
    loading.hide()
})

const associationName = ref<string>('')

const initAssociationName = () => {
    const association = userStore.user?.associations.find(obj => obj.id === parseInt(route.params.id as string))
    if (association) associationName.value = association.name
}

const isAuthorized = () => {
    return userStore.userAssociations.find(obj => obj.association.id === parseInt(route.params.id as string))?.isPresident
}

async function onGetAssociationUsers() {
    try {
        const associationId = parseInt(route.params.id as string)
        await initAssociationMembers(associationId, false)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

function reverseDate(date: string | null) {
    if (!date) return '-'
    else {
        return date.split('-').reverse().join('/')
    }
}

const columns: QTableProps['columns'] = [
    {
        name: 'firstName',
        required: true,
        label: t('user.first-name'),
        align: 'left',
        field: 'firstName',
        sortable: true
    },
    {
        name: 'lastName',
        required: true,
        label: t('user.last-name'),
        align: 'left',
        field: 'lastName',
        sortable: true
    },
    {
        name: 'role',
        align: 'left',
        label: t('dashboard.association-user.role'),
        field: 'role',
        sortable: true
    },
    {
        name: 'isValidatedByAdmin',
        align: 'right',
        label: t('account-validated'),
        field: 'isValidatedByAdmin',
        sortable: true
    },
    {
        name: 'delegationFrom',
        align: 'left',
        label: t('dashboard.association-user.delegate-from'),
        field: 'delegationFrom',
        sortable: true
    },
    {
        name: 'delegationTo',
        align: 'left',
        label: t('dashboard.association-user.delegate-to'),
        field: 'delegationTo',
        sortable: true
    },
    {
        name: 'delegation',
        align: 'center',
        label: t('delegate'),
        field: 'delegation',
        sortable: false
    }
]

</script>

<template>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-award"
            ></i>
            {{ t('dashboard.association-user.delegate') + ' ' + associationName }}
        </h2>
        <div class="dashboard-section-container">
            <div class="container">
                <InfoPresidencyDelegation/>
                <QTable
                    :columns="columns"
                    :loading="!associationMembers"
                    :no-data-label="t('dashboard.association-user.no-member')"
                    :rows="associationMembers"
                    :rows-per-page-options="[10, 20, 50, 0]"
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
                                key="role"
                                :props="props"
                                headers="role"
                            >
                                {{ props.row.role }}
                            </QTd>
                            <QTd
                                key="isValidatedByAdmin"
                                :props="props"
                                headers="isValidatedByAdmin"
                            >
                                <span class="form-state">
                                    {{ props.row.isValidatedByAdmin ? t('yes') : t('no') }}
                                    <span
                                        :class="props.row.isValidatedByAdmin ? 'form-state-icon form-state-green' : 'form-state-icon form-state-red'"
                                        aria-hidden="true"
                                    >
                                        <i :class="props.row.isValidatedByAdmin ? 'bi bi-check' : 'bi bi-x'"></i>
                                    </span>
                                </span>
                            </QTd>
                            <QTd
                                key="delegationFrom"
                                :props="props"
                                headers="delegationFrom"
                            >
                                {{ reverseDate(props.row.canBePresidentFrom) }}
                            </QTd>
                            <QTd
                                key="delegationTo"
                                :props="props"
                                headers="delegationTo"
                            >
                                {{ reverseDate(props.row.canBePresidentTo) }}
                            </QTd>
                            <QTd
                                key="delegation"
                                :props="props"
                                class="actions-cell-compact"
                                headers="delegation"
                            >
                                <div
                                    v-if="props.row.isValidatedByAdmin"
                                    class="button-container"
                                >
                                    <FormAssociationPresidencyDelegation :member="props.row"/>
                                </div>
                            </QTd>
                        </QTr>
                    </template>
                    <template v-slot:pagination="scope">
                        {{
                            t('table.results-amount', {
                                firstResult: scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1,
                                lastResult: scope.pagination.rowsPerPage * scope.pagination.page,
                                amountResults: scope.pagination.rowsPerPage * scope.pagesNumber
                            })
                        }}
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            :aria-label="t('table.first-page')"
                            :disable="scope.isFirstPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-double-left"
                            @click="scope.firstPage"
                        />
                        <QBtn
                            :aria-label="t('table.previous-page')"
                            :disable="scope.isFirstPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-left"
                            @click="scope.prevPage"
                        />
                        <QBtn
                            :aria-label="t('table.next-page')"
                            :disable="scope.isLastPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-right"
                            @click="scope.nextPage"
                        />
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            :aria-label="t('table.last-page')"
                            :disable="scope.isLastPage"
                            color="grey-8"
                            dense
                            flat
                            icon="bi-chevron-double-right"
                            @click="scope.lastPage"
                        />
                    </template>
                </QTable>
                <div class="flex-row-center padding-top">
                    <QBtn
                        :label="t('back')"
                        :to="{ name: 'AssociationDashboard', params: { id: route.params.id } }"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-chevron-compact-left"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';
</style>
