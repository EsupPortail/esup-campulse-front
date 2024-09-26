<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import useUserAssociations from '@/composables/useUserAssociations'
import AlertConfirmUserQuitAssociation from '@/components/alert/AlertConfirmUserQuitAssociation.vue'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const today = new Date()
today.setHours(0, 0, 0, 0)
const {
    userAssociations,
    associationRoleOptions,
    getUserAssociations,
    initUserAssociations
} = useUserAssociations()
const {catchHTTPError} = useErrors()

onMounted(async () => {
    loading.show()
    await onGetUserAssociations()
    loading.hide()
})

// Load userAssociations
async function onGetUserAssociations() {
    try {
        await getUserAssociations(userStore.user?.id, false)
        initUserAssociations(false)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
}
</script>

<template>
    <p v-if="userAssociations.length === 0">
        {{
            t('dashboard.association-user.you-are-not-an-association-member')
        }}
    </p>
    <QCard
        v-for="association in userAssociations"
        :key="association.id ? association.id : 0"
        class="association-card"
    >
        <QCardSection>
            <div id="association-card">
                <h3>{{ association.name }}</h3>
                <ul>
                    <li>
                        {{ t('dashboard.association-user.my-role') }}{{ t('colon') }}<span>{{
                            associationRoleOptions.find(obj => obj.value === association.role)?.label ??
                                t('dashboard.association-user.member')
                        }}</span>
                    </li>
                    <li>
                        {{ t('dashboard.association-user.presidency-status') }}{{ t('colon') }}<span>{{
                            (association.role === 'isPresident'
                                || (association?.canBePresidentFrom && association?.canBePresidentFrom !== null
                                    && (new Date(association?.canBePresidentFrom)) >= today) || (association?.canBePresidentTo
                                    && association?.canBePresidentTo !== null && (new Date(association?.canBePresidentTo)) <=
                                        today)) ? t('yes') : t('no')
                        }}</span>
                    </li>
                    <li>
                        {{ t('dashboard.association-user.is-validated-by-admin') }}{{ t('colon') }}<span>{{
                            association.isValidatedByAdmin ? t('yes') : t('no')
                        }}</span>
                    </li>
                </ul>
                <div class="flex-row padding-top padding-bottom">
                    <AlertConfirmUserQuitAssociation
                        :association-id="association.id ? association.id : 0"
                        :edited-by-staff="false"
                        :user-id="userStore.user?.id ? userStore.user?.id : 0"
                        @user-association-deleted="onGetUserAssociations"
                    />
                    <QBtn
                        v-if="association.isValidatedByAdmin && association.id !== null && userStore.hasPresidentStatus(association.id)"
                        :label="t('dashboard.association-user.manage-association')"
                        :to="{ name: 'AssociationDashboard', params: { id: association.id } }"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-pencil"
                        outline
                    />
                </div>
            </div>
        </QCardSection>
    </QCard>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';

ul {
    margin-left: 1.5rem;
}
</style>
