<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted} from 'vue'
import {QTableProps, useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import type {AssociationUserDetail} from '#/user'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserStore} from '@/stores/useUserStore'
import FormAssociationPresidencyDelegation from "@/components/form/FormAssociationPresidencyDelegation.vue";

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const route = useRoute()
const associationStore = useAssociationStore()
const userStore = useUserStore()


onMounted(async () => {
    loading.show
    await onGetAssociationUsers()
    loading.hide
})


async function onGetAssociationUsers() {
    try {
        await associationStore.getAssociationUsers(parseInt(route.params.id as string))
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

function getAssociationUserRole(user: AssociationUserDetail) {
    return user.isPresident ? t('dashboard.association-user.is-president') :
        user.isSecretary ? t('dashboard.association-user.is-secretary') :
            user.isTreasurer ? t('dashboard.association-user.is-treasurer') :
                user.isVicePresident ? t('dashboard.association-user.is-vice-president') :
                    t('dashboard.association-user.member')
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
        name: 'canBePresident',
        align: 'left',
        label: 'Délégation',
        field: 'canBePresident',
        sortable: true
    },
    {
        name: 'delegationFrom',
        align: 'left',
        label: 'Début',
        field: 'delegationFrom',
        sortable: true
    },
    {
        name: 'delegationTo',
        align: 'left',
        label: 'Fin',
        field: 'delegationTo',
        sortable: true
    },
    {
        name: 'delegation',
        align: 'left',
        label: t('dashboard.association-user.delegate-presidency'),
        field: 'edition',
        sortable: true
    }
]

</script>

<template>
    <div class="form-container">
        <div class="form">
            <QTable
                :columns="columns"
                :rows="associationStore.associationUsers"
                :rows-per-page-options="[10, 20, 50, 0]"
                :title="t('user-manager.users')"
                row-key="id"
            >
                <template v-slot:body="props">
                    <QTr :props="props">
                        <QTd key="firstName" :props="props">
                            {{ props.row.user.firstName }}
                        </QTd>
                        <QTd key="lastName" :props="props">
                            {{ props.row.user.lastName }}
                        </QTd>
                        <QTd key="role" :props="props">
                            {{ getAssociationUserRole(props.row) }}
                        </QTd>
                        <QTd key="canBePresident" :props="props">
                            <span
                                v-if="props.row.canBePresident"
                                class="form-state"
                            >
                                Activée
                                <span class="form-state-icon form-state-green"><i class="bi bi-check"></i></span>
                            </span>
                            <span
                                v-else
                                class="form-state"
                            >
                                Désactivée
                                <span class="form-state-icon form-state-red"><i class="bi bi-x"></i></span>
                            </span>
                        </QTd>
                        <QTd key="delegationFrom" :props="props">
                            {{ props.row.canBePresidentFrom }}
                        </QTd>
                        <QTd key="delegationTo" :props="props">
                            {{ props.row.canBePresidentTo }}
                        </QTd>
                        <QTd key="delegation" :props="props" class="actions-cell-compact">
                            <div class="button-container">
                                <FormAssociationPresidencyDelegation :member="props.row"/>
                            </div>
                        </QTd>
                    </QTr>
                </template>
            </QTable>
        </div>
    </div>
</template>

<style lang="sass">
@import '@/assets/styles/dashboard.scss'
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>

</style>
