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


const {t} = useI18n()
const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const route = useRoute()
const {userAssociations} = useUsers()
const {associationRoleOptions} = useAssociation()
const {groupCanJoinAssociation} = useUserGroups()


onMounted(async () => {
    loading.show
    await onGetUserAssociations()
    loading.hide
})

const initValues = () => {
    userManagerStore.userAssociations.forEach(function (association) {
        let role = ''
        if (association.isPresident) role = 'isPresident'
        if (association.isSecretary) role = 'isSecretary'
        if (association.isTreasurer) role = 'isTreasurer'
        userAssociations.value.push({
            id: association.association.id,
            name: association.association.name,
            role,
            options: associationRoleOptions,
            canBePresident: association.canBePresident,
            deleteAssociation: false
        })
    })
}
watch(() => userManagerStore.userAssociations, initValues)

// Load userAssociations
async function onGetUserAssociations() {
    try {
        userAssociations.value = []
        await userManagerStore.getUserAssociations(parseInt(route.params.id as string))
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
    </fieldset>
</template>

<style lang="sass" scoped>
.association-cards
    display: flex
    flex-direction: column
    gap: 20px

.association-cards .q-checkbox
    width: 100%

h4
    font-size: 1.5em
    padding: 0
    line-height: 0

.q-select, .q-input
    margin-bottom: 20px

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
