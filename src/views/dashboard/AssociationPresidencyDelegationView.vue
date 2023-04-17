<script lang="ts" setup>
import {onMounted} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {useAssociationStore} from '@/stores/useAssociationStore'
import FormAssociationPresidencyDelegation from '@/components/form/FormAssociationPresidencyDelegation.vue'
import useUserAssociations from '@/composables/useUserAssociations'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const route = useRoute()
const associationStore = useAssociationStore()
const {initAssociationMembers, associationMembers} = useUserAssociations()

onMounted(async () => {
    loading.show()
    await onGetAssociationUsers()
    await onGetAssociationDetail()
    loading.hide()
})

async function onGetAssociationUsers() {
    try {
        const associationId = parseInt(route.params.id as string)
        await initAssociationMembers(associationId, false)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), false)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

function reverseDate(date: string | null) {
    if (!date) return '-'
    else {
        const dateArray = date.split('-')
        return dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]
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
        align: 'left',
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
        align: 'right',
        label: t('delegate'),
        field: 'delegation',
        sortable: false
    }
]

</script>

<template>
    <section class="dashboard-section">
        <h2 v-if="associationStore.association">
            <i
                aria-hidden="true"
                class="bi bi-award"
            ></i>
            {{ t('dashboard.association-user.delegate') + ' ' + associationStore.association?.name }}
        </h2>
        <div class="form-container">
            <div class="form">
                <QTable
                    :columns="columns"
                    :no-data-label="t('dashboard.association-user.no-member')"
                    :rows="associationMembers"
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
                                key="role"
                                :props="props"
                            >
                                {{ props.row.role }}
                            </QTd>
                            <QTd
                                key="isValidatedByAdmin"
                                :props="props"
                            >
                                <span class="form-state">
                                    {{ props.row.isValidatedByAdmin ? t('yes') : t('no') }}
                                    <span
                                        :class="props.row.isValidatedByAdmin ? 'form-state-icon form-state-green' : 'form-state-icon form-state-red'"
                                    >
                                        <i :class="props.row.isValidatedByAdmin ? 'bi bi-check' : 'bi bi-x'"></i>
                                    </span>
                                </span>
                            </QTd>
                            <QTd
                                key="delegationFrom"
                                :props="props"
                            >
                                {{ reverseDate(props.row.canBePresidentFrom) }}
                            </QTd>
                            <QTd
                                key="delegationTo"
                                :props="props"
                            >
                                {{ reverseDate(props.row.canBePresidentTo) }}
                            </QTd>
                            <QTd
                                key="delegation"
                                :props="props"
                                class="actions-cell-compact"
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
                </QTable>
                <section class="form-page-navigation">
                    <QBtn
                        :label="t('back')"
                        :to="{name: 'AssociationDashboard', params: {id: route.params.id}}"
                        icon="bi-chevron-compact-left"
                    />
                </section>
            </div>
        </div>
    </section>
</template>

<style lang="sass">
@import '@/assets/styles/dashboard.scss'
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>

</style>
