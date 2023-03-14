<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import {useRoute} from 'vue-router'
import FormRegisterUserAssociation from '@/components/form/FormRegisterUserAssociations.vue'
import useUserGroups from '@/composables/useUserGroups'
import type {User} from '#/user'
import {useUserStore} from '@/stores/useUserStore'
import useUserAssociations from '@/composables/useUserAssociations'
import useSecurity from '@/composables/useSecurity'
import AlertConfirmUserQuitAssociation from "@/components/alert/AlertConfirmUserQuitAssociation.vue";

const props = defineProps<{
    editedByStaff: boolean,
    user: User | undefined
}>()

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userStore = useUserStore()
const {userAssociationsRegister} = useSecurity()
const route = useRoute()
const {
    userAssociations,
    updateUserAssociations,
    associationRoleOptions,
    getUserAssociations,
    newAssociations
} = useUserAssociations()
const {groupCanJoinAssociation} = useUserGroups()

onMounted(async () => {
    loading.show
    await onGetUserAssociations()
    loading.hide
})

// Load userAssociations
async function onGetUserAssociations() {
    try {
        userAssociations.value = []
        const id = props.editedByStaff ? parseInt(route.params.id as string) : userStore.user?.id
        await getUserAssociations(id as number, props.editedByStaff)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

async function onUpdateUserAssociations() {
    try {
        await updateUserAssociations(props.editedByStaff)
        await userAssociationsRegister(route.name === 'Registration', props.user?.username)
        newAssociations.value = []
        await getUserAssociations(null, false)
        notify({
            type: 'positive',
            message: t('notifications.positive.associations-successfully-updated')
        })
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.edit-user-associations-error')
        })
    }
}
</script>

<template>
    <fieldset class="association-cards">
        <legend>{{ props.editedByStaff ? t('user.associations') : t('dashboard.my-associations') }}</legend>
        <p v-if="userAssociations.length === 0">
            {{
                props.editedByStaff ? t('user.has-no-association') : t('dashboard.association-user.you-are-not-an-association-member')
            }}</p>
        <QCard
            v-for="association in userAssociations"
            :key="association.id ? association.id : 0"
            class="association-card"
        >
            <QCardSection>
                <article>
                    <h4>{{ association.name }}</h4>
                    <QOptionGroup
                        v-if="props.editedByStaff"
                        v-model="association.role"
                        :options="association.options"
                        color="primary"
                        @update:model-value="association.role === 'isPresident' ? association.canBePresident = false : association.canBePresident"
                    />
                    <ul v-else>
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
                    <QCheckbox
                        v-if="props.editedByStaff"
                        v-model="association.canBePresident"
                        :disable="association.role === 'isPresident'"
                        :label="t('forms.i-can-be-president')"
                    />
                    <div class="btn-group">
                        <div v-if="!props.editedByStaff">
                            <AlertConfirmUserQuitAssociation
                                :association-id="association.id"
                                :edited-by-staff="props.editedByStaff"
                                :user-id="user.id"
                                @user-association-deleted="onGetUserAssociations"
                            />
                        </div>
                        <div v-else>
                            <QBtn
                                v-if="!association.deleteAssociation"
                                :label="props.editedByStaff ? t('dashboard.association-user.delete-association') : t('dashboard.association-user.delete-association-self')"
                                color="red"
                                icon="mdi-delete"
                                @click="association.deleteAssociation = true"
                            />
                            <div v-else>
                                <span class="delete-message">
                                    {{ t('user.delete-association-role') }}
                                </span>
                                <QBtn
                                    :label="t('cancel-delete')"
                                    icon="mdi-cancel"
                                    outline
                                    @click="association.deleteAssociation = false"
                                />
                            </div>
                        </div>
                        <QBtn
                            v-if="!props.editedByStaff && association.isValidatedByAdmin && userStore.hasPresidentStatus(association.id)"
                            :label="t('dashboard.association-user.manage-association')"
                            :to="{name: 'AssociationDashboard', params: {id: association.id}}"
                        />
                    </div>
                </article>
            </QCardSection>
        </QCard>
        <QCard v-if="groupCanJoinAssociation">
            <QCardSection>
                <FormRegisterUserAssociation/>
            </QCardSection>
        </QCard>
        <div>
            <QBtn
                v-if="!props.editedByStaff"
                :label="t('validate-changes')"
                @click="onUpdateUserAssociations"
            />
        </div>
    </fieldset>
</template>

<style lang="sass" scoped>
.association-cards, .association-cards article
    display: flex
    flex-direction: column
    gap: 20px
    margin-top: 20px

fieldset
    border: none

fieldset .q-checkbox
    width: 100%

h4
    font-size: 1.5em
    padding: 0
    line-height: 0

legend
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center
    width: 100%
    margin-bottom: 10px

.delete-message
    color: red

.btn-group
    display: flex
    gap: 10px
    margin-top: 15px

ul
    padding: 10px
</style>
