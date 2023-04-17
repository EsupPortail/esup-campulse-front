<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useUserAssociations from '@/composables/useUserAssociations'

const {t} = useI18n()
const {notify, loading} = useQuasar()

const {
    getUnvalidatedAssociationUsers,
    associationMembers
} = useUserAssociations()


onMounted(async () => {
    loading.show
    await onGetAssociationUsers()
    loading.hide
})

const isLoaded = ref<boolean>(false)

async function onGetAssociationUsers() {
    try {
        await getUnvalidatedAssociationUsers()
        isLoaded.value = true
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
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
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <QTable
                    :columns="columns"
                    :loading="!isLoaded"
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
                                key="association"
                                :props="props"
                            >
                                {{ props.row.associationName }}
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
                                key="validation"
                                :props="props"
                                class="actions-cell-compact"
                            >
                                <QBtn
                                    :label="t('manage')"
                                    :to="{name: 'AssociationUserValidationDetail', params: {userId: props.row.id, associationId: props.row.associationId}}"
                                    color="secondary"
                                    icon="mdi-check-circle"
                                />
                            </QTd>
                        </QTr>
                    </template>
                </QTable>
                <section class="form-page-navigation">
                    <QBtn
                        :label="t('back')"
                        :to="{ name: 'Dashboard' }"
                        icon="bi-chevron-compact-left"
                    />
                </section>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

.form-page-navigation {
    width: $buttonSize;
    padding: 0;
}
</style>
