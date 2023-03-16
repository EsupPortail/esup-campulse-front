<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import type {AssociationUser} from '#/user'
import {useAssociationStore} from "@/stores/useAssociationStore";
import {Association} from "#/association";
import {useUserStore} from "@/stores/useUserStore";
import FormAssociationPresidencyDelegation from '@/components/form/FormAssociationPresidencyDelegation.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const route = useRoute()
const associationStore = useAssociationStore()
const userStore = useUserStore()

const association = ref<Association>()
const hasPresidentStatus = ref<boolean>(false)

const initValues = () => {
    association.value = associationStore.association
    hasPresidentStatus.value = userStore.hasPresidentStatus(association?.value?.id as number)
}
watch(() => associationStore.association, initValues)

onMounted(async () => {
    loading.show
    initValues()
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

/*
watch(() => associationStore.associationUsers, () => {
    associationUsers.value = associationStore.associationUsers.map(user => {
        const watchedUser = reactive(user)
        watch(() => [user.canBePresidentFrom, user.canBePresidentTo], ([from, to], [prevFrom, prevTo]) => {
            if (from !== prevFrom || to !== prevTo) {
                watchedUser.hasChanged = true
            }
        })
        return watchedUser
    })
})
*/

function getAssociationUserRole(user: AssociationUser) {
    return user.isPresident ? t('dashboard.association-user.is-president') :
        user.isSecretary ? t('dashboard.association-user.is-secretary') :
            user.isTreasurer ? t('dashboard.association-user.is-treasurer') :
                user.isVicePresident ? t('dashboard.association-user.is-vice-president') : 'none'
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
    {name: 'userName', align: 'left', label: t('forms.email'), field: 'user', sortable: true},
    {
        name: 'role',
        align: 'left',
        label: t('association.role-user'),
        field: 'role',
        sortable: true
    },
    {
        name: 'isValidatedByAdmin',
        align: 'left',
        label: t('user-manager.is-validated'),
        field: 'isValidatedByAdmin',
        sortable: true
    },
    {
        name: 'delegation',
        align: 'left',
        label: t('association.delegate-president-role'),
        field: 'edition',
        sortable: true
    }
]

</script>

<template>
    <h1>{{ t("association.delegate-president-role") }}</h1>
    <QTable :columns="columns" :rows="associationStore.associationUsers" :rows-per-page-options="[10, 20, 50, 0]"
            :title="t('user-manager.users')"
            row-key="id">
        <template v-slot:body="props">
            <QTr :props="props">
                <QTd key="id" :props="props">
                    {{ props.row.id }}
                </QTd>
                <QTd key="userName" :props="props">
                    {{ props.row.user }}
                </QTd>
                <QTd key="role" :props="props">
                    {{ getAssociationUserRole(props.row) }}
                </QTd>
                <QTd key="isValidatedByAdmin" :props="props">
                    <QChip :color="props.row.isValidatedByAdmin ? 'teal' : 'red'" text-color="white">
                        {{ props.row.isValidatedByAdmin ? t('yes') : t('no') }}
                    </QChip>
                </QTd>
                <QTd v-if="!props.row.isPresident">
                    <FormAssociationPresidencyDelegation
                        :associationUser="props.row"
                    />
                </QTd>
            </QTr>
        </template>
    </QTable>
</template>

<style lang="sass" scoped>
ul
    margin-left: -40px

li
    list-style: none
</style>
