<script lang="ts" setup>
import useAssociation from '@/composables/useAssociation'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'
import type {AssociationSocialNetwork} from '#/association'
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
    <div
            v-for="(socialNetwork, index) in associationSocialNetworks"
            id="network-section"
            :key="index"
            class="display-row"
    >
        <div class="flex-row">
            <QInput
                    v-model="socialNetwork.type"
                    :hint="t('forms.social-network-type-hint')"
                    :label="t('association.labels.social-network-type') + ' *'"
                    :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                    aria-required="true"
                    clearable
                    filled
                    lazy-rules
            />
            <QInput
                    v-model="socialNetwork.location"
                    :hint="t('forms.social-network-location-hint')"
                    :label="t('association.labels.social-network-location') + ' *'"
                    :rules="[val => val && val.length > 0 && urlRegex.test(val) || t('forms.required-valid-url')]"
                    aria-required="true"
                    clearable
                    filled
                    lazy-rules
                    type="url"
            />
            <QSeparator
                    aria-hidden="true"
                    role="presentation"
            />
            <QBtn
                    :aria-label="t('delete')"
                    color="red"
                    icon="bi-trash"
                    outline
                    @click="removeNetwork(index)"
            />
        </div>
    </div>
    <div class="padding-top">
        <QBtn
                :label="t('association.labels.add-social-network')"
                class="btn-lg"
                color="association"
                icon="bi-plus-circle"
                outline
                @click="addNetwork"
        />
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/variables.scss';

.q-input {
  width: $fullSize;
}
</style>
