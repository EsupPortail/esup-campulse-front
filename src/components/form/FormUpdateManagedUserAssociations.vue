<script lang="ts" setup>
import AlertConfirmUserAssociationDelete from '@/components/alert/AlertConfirmUserAssociationDelete.vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'


const {t} = useI18n()
const {notify, loading} = useQuasar()
const {newUserAssociations} = useUsers()
const userManagerStore = useUserManagerStore()
const route = useRoute()


onMounted(async () => {
    loading.show
    await onGetUserAssociations()
    loading.hide
})

// Load userAssociations
async function onGetUserAssociations() {
    try {
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
        <QCard
            v-for="(association, index) in newUserAssociations"
            :key="index"
            class="association-card"
        >
            <QCardSection>
                <article>
                    <h4>{{ association.association.name }}</h4>
                    <QInput
                        v-model="association.roleName"
                        :label="t('dashboard.association-user.role')"
                        :rules="[ val => val && val.length > 0 || t('forms.required-last-name')]"
                        filled
                        lazy-rules
                    />
                    <QSelect
                        v-model="association.hasOfficeStatus"
                        :label="t('dashboard.association-user.has-office-status')"
                        :options="booleanSelectOptions"
                        emit-value
                        filled
                        map-options
                    />
                    <QSelect
                        v-model="association.isPresident"
                        :label="t('dashboard.association-user.is-president')"
                        :options="booleanSelectOptions"
                        emit-value
                        filled
                        map-options
                    />
                    <AlertConfirmUserAssociationDelete :association-id="association.association.id"/>
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

.q-select
    margin-bottom: 20px
</style>