<script lang="ts" setup>
import useAssociation from '@/composables/useAssociation'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'
import {AssociationSocialNetwork} from '#/association'
import {onMounted, watch} from 'vue'
import {useAssociationStore} from '@/stores/useAssociationStore'

const {addNetwork, removeNetwork, associationSocialNetworks} = useAssociation()
const {urlRegex} = useUtility()
const {t} = useI18n()
const associationStore = useAssociationStore()


const initValues = () => {
    // Social networks are stored in useAssociation composable, so we can add and remove items
    associationSocialNetworks.value = JSON.parse(JSON.stringify(associationStore.association?.socialNetworks as AssociationSocialNetwork[]))
}
watch(() => associationStore.association, initValues)

onMounted(initValues)

</script>
<template>
    <fieldset>
        <legend>{{ t('association.labels.socials') }}</legend>
        <section v-for="(socialNetwork, index) in associationSocialNetworks" :key="index">
            <QInput
                v-model="socialNetwork.type"
                :hint="t('forms.social-network-type-hint')"
                :label="t('association.labels.social-network-type')"
                :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="socialNetwork.location"
                :hint="t('forms.social-network-location-hint')"
                :label="t('association.labels.social-network-location')"
                :rules="[ val => val && val.length > 0 && urlRegex.test(val) || t('forms.required-valid-url')]"
                filled
                lazy-rules
                type="url"
            />
            <QBtn
                :label="t('delete')"
                color="red"
                icon="mdi-delete"
                outline
                @click="removeNetwork(index)"
            />
        </section>
        <QBtn
            :label="t('association.labels.add-social-network')"
            color="primary"
            icon="mdi-plus-circle-outline"
            outline
            @click="addNetwork"
        />
    </fieldset>
</template>

<style lang="sass" scoped>
fieldset
    section
        display: flex
        gap: 10px

    section > .q-input
        flex-grow: 2
        margin-bottom: 10px

    section > .q-btn
        margin-bottom: 30px

legend
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center
    width: 100%
    margin-bottom: 15px
</style>