<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useUserAssociations from '@/composables/useUserAssociations'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()

const {
    getUnvalidatedAssociationUsers,
    associationMembers
} = useUserAssociations()


onMounted(async () => {
    loading.show()
    await onGetAssociationUsers()
    loading.hide()
})

const isLoaded = ref<boolean>(false)

async function onGetAssociationUsers() {
    try {
        await getUnvalidatedAssociationUsers()
        isLoaded.value = true
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
}

const columns: QTableProps['columns'] = [
    {name: 'firstName', align: 'left', label: t('forms.first-name'), field: 'firstName', sortable: true},
    {name: 'lastName', align: 'left', label: t('forms.last-name'), field: 'lastName', sortable: true},
    {
        name: 'association',
        align: 'center',
        label: t('dashboard.association-user.association'),
        field: 'association',
        sortable: true
    },
    {
        name: 'role',
        align: 'center',
        label: t('dashboard.association-user.role'),
        field: 'role',
        sortable: true
    },
    {
        name: 'isValidatedByAdmin',
        align: 'right',
        label: t('user-manager.association-affiliation'),
        field: 'isValidatedByAdmin',
        sortable: true
    },
    {
        name: 'validation',
        align: 'center',
        label: t('manage'),
        field: 'validation',
        sortable: false
    }
]

</script>

<template>
    <div class="dashboard-section">
        <div class="dashboard-section-container">
            <div class="container">
                <QTable
                    :columns="columns"
                    :loading="!isLoaded"
                    :rows="associationMembers"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    :title="t('user-manager.users')"
                    row-key="id"
                    role="presentation"
                >
                    <template v-slot:header="props">
                        <QTr :props="props">
                            <QTh
                                v-for="col in props.cols"
                                :key="col.name"
                                :props="props"
                                scope="col"
                                :id="col.name"
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
                                key="association"
                                :props="props"
                                headers="association"
                            >
                                {{ props.row.associationName }}
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
                                key="validation"
                                :props="props"
                                headers="validation"
                                class="actions-cell-compact"
                            >
                                <QBtn
                                    :aria-label="t('manage')"
                                    :to="{name: 'AssociationUserValidationDetail', params: {userId: props.row.id, associationId: props.row.associationId}}"
                                    color="dashboard"
                                    icon="bi-pencil"
                                    outline
                                />
                            </QTd>
                        </QTr>
                    </template>
                    <template v-slot:pagination="scope">
                        {{ t('table.results-amount', {
                            firstResult: scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1,
                            lastResult: scope.pagination.rowsPerPage * scope.pagination.page,
                            amountResults: scope.pagination.rowsPerPage * scope.pagesNumber
                        }) }}
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            icon="bi-chevron-double-left"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isFirstPage"
                            @click="scope.firstPage"
                            :aria-label="t('table.first-page')"
                        />
                        <QBtn
                            icon="bi-chevron-left"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isFirstPage"
                            @click="scope.prevPage"
                            :aria-label="t('table.previous-page')"
                        />
                        <QBtn
                            icon="bi-chevron-right"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isLastPage"
                            @click="scope.nextPage"
                            :aria-label="t('table.next-page')"
                        />
                        <QBtn
                            v-if="scope.pagesNumber > 2"
                            icon="bi-chevron-double-right"
                            color="grey-8"
                            dense
                            flat
                            :disable="scope.isLastPage"
                            @click="scope.lastPage"
                            :aria-label="t('table.last-page')"
                        />
                    </template>
                </QTable>

                <div class="flex-row-center padding-top">
                    <QBtn
                        :label="t('back')"
                        :to="{ name: 'Dashboard' }"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-chevron-compact-left"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/_variables.scss';
</style>
