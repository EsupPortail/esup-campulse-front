<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, watch} from 'vue'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useRoute} from 'vue-router'
import useUsers from '@/composables/useUsers'
import useAssociation from "@/composables/useAssociation";
import FormRegisterUserAssociation from '@/components/form/FormRegisterUserAssociations.vue'
import useUserGroups from "@/composables/useUserGroups";
import {AssociationUser, AssociationUserDetail} from "#/user";
import {useUserStore} from "@/stores/useUserStore";

const props = defineProps<{
    editedByStaff: boolean
}>()

const {t} = useI18n()
const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const userStore = useUserStore()
const route = useRoute()
const {userAssociations, updateUserAssociations} = useUsers()
const {associationRoleOptions, getUserAssociations} = useAssociation()
const {groupCanJoinAssociation} = useUserGroups()

onMounted(async () => {
    loading.show
    await onGetUserAssociations()
    loading.hide
})

const initValues = () => {
    let associations: AssociationUser[] | AssociationUserDetail[] = userStore.userAssociations
    if (props.editedByStaff) associations = userManagerStore.userAssociations
    associations.forEach(function (association) {
        let role = ''
        if (association.isPresident) role = 'isPresident'
        if (association.isSecretary) role = 'isSecretary'
        if (association.isTreasurer) role = 'isTreasurer'
        userAssociations.value.push({
            id: props.editedByStaff ? (association as AssociationUserDetail).association.id : (association as AssociationUser).association,
            name: props.editedByStaff ? (association as AssociationUserDetail).association.name :
                userStore.user?.associations.find(obj => obj.id === association.association)?.name,
            role,
            options: associationRoleOptions,
            canBePresident: association.canBePresident,
            deleteAssociation: false
        })
    })
}
watch(() => userManagerStore.userAssociations, initValues)
watch(() => userStore.userAssociations, initValues)

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
        userManagerStore.user = userStore.user
        await updateUserAssociations()
        notify({
            type: 'positive',
            message: 'Les associations ont bien été mises à jour.'
        })
    } catch (error) {
        notify({
            type: 'negative',
            message: 'Une erreur est survenue.'
        })
    }
}
</script>

<template>
    <fieldset class="association-cards">
        <legend>{{ props.editedByStaff ? t('user.associations') : t('dashboard.my-associations') }}</legend>
        <p v-if="userAssociations.length === 0">{{ t('user.has-no-association') }}</p>
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
                        <li>Mon rôle : {{
                                associationRoleOptions.find(obj => obj.value === association.role)?.label
                            }}
                        </li>
                        <li>
                            Droit de présidence : {{
                                (association.role === 'isPresident' || association.canBePresident) ? t('yes') : t('no')
                            }}
                        </li>
                    </ul>
                    <QCheckbox
                        v-if="props.editedByStaff"
                        v-model="association.canBePresident"
                        :disable="association.role === 'isPresident'"
                        :label="t('forms.i-can-be-president')"
                    />
                    <div class="btn-group">
                        <QBtn
                            v-if="!association.deleteAssociation"
                            :label="t('dashboard.association-user.delete-association')"
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
                        <QBtn
                            :to="{name: 'AssociationDashboard', params: {id: association.id}}"
                            label="Gérer l'association"
                        />
                    </div>
                </article>
            </QCardSection>
        </QCard>
        <QCard v-if="props.editedByStaff || (route.name === 'Registration' && groupCanJoinAssociation)">
            <QCardSection>
                <FormRegisterUserAssociation/>
            </QCardSection>
        </QCard>
        <div>
            <QBtn
                v-if="!props.editedByStaff"
                label="Valider les changements"
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
</style>
