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
const {userAssociations} = useUsers()
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
</script>

<template>
    <fieldset class="association-cards">
        <legend>{{ t('user.associations') }}</legend>
        <p v-if="userAssociations.length === 0">{{ t('user.has-no-association') }}</p>
        <QCard v-for="association in userAssociations" :key="association.id ? association.id : 0"
               class="association-card">
            <QCardSection>
                <article>
                    <h4>{{ association.name }}</h4>
                    <QOptionGroup
                        v-model="association.role"
                        :options="association.options"
                        color="primary"
                        @update:model-value="association.role === 'isPresident' ? association.canBePresident = false : association.canBePresident"
                    />
                    <QCheckbox
                        v-model="association.canBePresident"
                        :disable="association.role === 'isPresident'"
                        :label="t('forms.i-can-be-president')"

                    />
                    <QBtn v-if="!association.deleteAssociation"
                          :label="t('dashboard.association-user.delete-association')"
                          color="red" icon="mdi-delete" @click="association.deleteAssociation = true"
                    />
                    <div v-else>
                        <span class="delete-message">
                            {{ t('user.delete-association-role') }}
                        </span>
                        <QBtn :label="t('cancel-delete')" color="secondary" icon="mdi-cancel" outline
                              @click="association.deleteAssociation = false"/>
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
                label="Valider les changements"
                @click=""
            />
        </div>
    </fieldset>
</template>

<style lang="sass" scoped>
.association-cards
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
</style>
