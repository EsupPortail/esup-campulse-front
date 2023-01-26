<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useRoute} from 'vue-router'
import useUsers from '@/composables/useUsers'


const {t} = useI18n()
const {notify, loading} = useQuasar()
const userManagerStore = useUserManagerStore()
const route = useRoute()
const {userAssociations} = useUsers()


onMounted(async () => {
    loading.show
    await onGetUserAssociations()
    loading.hide
})

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

// Boolean select options
const booleanSelectOptions = [
    {
        label: t('yes'),
        value: true
    },
    {
        label: t('no'),
        value: false
    }
]
</script>

<template>
    <fieldset class="association-cards">
        <legend>Associations</legend>
        <p v-if="userAssociations.length === 0">L'utilisateur n'est membre d'aucune association.</p>
        <QCard
            v-for="association in userAssociations"
            :key="association.associationId"
            class="association-card"
        >
            <QCardSection>
                <article>
                    <h4>{{ association.associationName }}</h4>
                    <QInput
                        v-model="association.roleName"
                        :disable="!!association.deleteAssociation"
                        :label="t('dashboard.association-user.role')"
                        filled
                        lazy-rules
                    />
                    <QSelect
                        v-model="association.hasOfficeStatus"
                        :disable="!!association.deleteAssociation"
                        :label="t('dashboard.association-user.has-office-status')"
                        :options="booleanSelectOptions"
                        emit-value
                        filled
                        map-options
                    />
                    <QSelect
                        v-model="association.isPresident"
                        :disable="!!association.deleteAssociation"
                        :label="t('dashboard.association-user.is-president')"
                        :options="booleanSelectOptions"
                        emit-value
                        filled
                        map-options
                    />
                    <QBtn
                        v-if="!association.deleteAssociation"
                        :label="t('dashboard.association-user.delete-association')"
                        color="red"
                        icon="mdi-delete"
                        @click="association.deleteAssociation = true"
                    />
                    <div v-else>
                        <span class="delete-message">
                            Le rôle dans l'association sera supprimé après validation des changements.
                        </span>
                        <QBtn
                            color="secondary"
                            icon="mdi-cancel"
                            label="Annuler la suppression"
                            outline
                            @click="association.deleteAssociation = false"
                        />
                    </div>
                </article>
            </QCardSection>
        </QCard>
    </fieldset>
</template>

<style lang="sass" scoped>
.association-cards
    display: flex
    flex-direction: column
    gap: 20px

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