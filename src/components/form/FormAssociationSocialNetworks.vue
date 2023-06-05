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
    <fieldset>
        <h3><i class="bi bi-megaphone"></i>{{ t('association.labels.socials') }}</h3>
        <section class="form-container">
            <div
                v-for="(socialNetwork, index) in associationSocialNetworks"
                id="network-section"
                :key="index"
                class="display-row"
            >
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
                <QBtn
                    :aria-label="t('delete')"
                    class="delete-network-btn"
                    color="delete"
                    icon="mdi-delete"
                    @click="removeNetwork(index)"
                />
            </div>
            <div class="display-row">
                <QBtn
                    :label="t('association.labels.add-social-network')"
                    class="add-network-btn"
                    icon="mdi-plus-circle-outline"
                    @click="addNetwork"
                />
            </div>
        </section>
    </fieldset>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import '@/assets/styles/forms.scss';

// Mobile version
.delete-network-btn {
  margin-top: .625rem;
}

@media screen and (min-width: $responsiveWidth) {
  .form-container {
    display: flex;
    flex-direction: column;
  }

  #network-section {
    flex-direction: row;
    gap: .625rem;

    .q-input {
      flex-grow: 2;
      margin-bottom: .625rem;
    }

    .delete-network-btn {
      margin-top: -.001rem;
      height: 3.5rem;
    }
  }

  .add-network-btn {
    width: 35%;
  }
}
</style>
