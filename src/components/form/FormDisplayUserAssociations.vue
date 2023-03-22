<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import {useUserStore} from '@/stores/useUserStore'
import useUserAssociations from '@/composables/useUserAssociations'
import AlertConfirmUserQuitAssociation from "@/components/alert/AlertConfirmUserQuitAssociation.vue";


const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const {
    userAssociations,
    associationRoleOptions,
    getUserAssociations,
    initUserAssociations
} = useUserAssociations()

onMounted(async () => {
    loading.show
    await onGetUserAssociations()
    loading.hide
})

// Load userAssociations
async function onGetUserAssociations() {
    try {
        await getUserAssociations(userStore.user?.id as number, false)
        initUserAssociations(false)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}
</script>

<template>
    <p v-if="userAssociations.length === 0">
        {{
            t('dashboard.association-user.you-are-not-an-association-member')
        }}</p>
    <QCard
        v-for="association in userAssociations"
        :key="association.id ? association.id : 0"
        class="association-card"
    >
        <QCardSection>
            <section>
                <h4>{{ association.name }}</h4>
                <ul>
                    <li>{{ t('dashboard.association-user.my-role') }} <span>{{
                            associationRoleOptions.find(obj => obj.value === association.role)?.label ?? t('dashboard.association-user.member')
                        }}</span>
                    </li>
                    <li>
                        {{ t('dashboard.association-user.presidency-status') }} <span>{{
                            (association.role === 'isPresident' || association.canBePresident) ? t('yes') : t('no')
                        }}</span>
                    </li>
                    <li>
                        {{ t('dashboard.association-user.is-validated-by-admin') }}
                        <span>{{ association.isValidatedByAdmin ? t('yes') : t('no') }}</span>
                    </li>
                </ul>
                <div class="btn-group">
                    <div>
                        <AlertConfirmUserQuitAssociation
                            :association-id="association.id"
                            :edited-by-staff="false"
                            :user-id="userStore.user?.id"
                            @user-association-deleted="onGetUserAssociations"
                        />
                    </div>
                    <QBtn
                        v-if="association.isValidatedByAdmin && userStore.hasPresidentStatus(association.id)"
                        :label="t('dashboard.association-user.manage-association')"
                        :to="{name: 'AssociationDashboard', params: {id: association.id}}"
                    />
                </div>
            </section>
        </QCardSection>
    </QCard>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>
.form
    display: flex
    flex-direction: column
    gap: 1rem

.association-card
    padding: 1rem

fieldset
    border: none

fieldset .q-checkbox
    width: 100%

h4
    font-size: 1.5em
    padding: 0
    line-height: 0

.delete-message
    color: red

.btn-group
    display: flex
    gap: 1rem
    margin-top: 1rem

ul
    padding: 1rem
    margin-top: 1rem
</style>
