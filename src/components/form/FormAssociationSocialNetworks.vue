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
    <fieldset class="form-container">
        <h2><i class="bi bi-megaphone"></i>{{ t('association.labels.socials') }}</h2>

        <div
            v-for="(socialNetwork, index) in associationSocialNetworks"
            id="network-section"
            :key="index"
            class="display-row"
        >
            <QInput
                v-model="socialNetwork.type"
                :hint="t('forms.social-network-type-hint')"
                :label="t('association.labels.social-network-type')"
                :rules="[val => val && val.length > 0 || t('forms.fill-field')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="socialNetwork.location"
                :hint="t('forms.social-network-location-hint')"
                :label="t('association.labels.social-network-location')"
                :rules="[val => val && val.length > 0 && urlRegex.test(val) || t('forms.required-valid-url')]"
                filled
                lazy-rules
                type="url"
            />
            <QBtn
                :label="t('delete')"
                class="delete-network-btn"
                color="delete"
                icon="mdi-delete"
                @click="removeNetwork(index)"
            />
        </div>

        <QBtn
            :label="t('association.labels.add-social-network')"
            class="add-network-btn"
            color="misc"
            icon="mdi-plus-circle-outline"
            outline @click="addNetwork"
        />
    </fieldset>
</template>

<style lang="scss">
@import "@/assets/styles/associations.scss";
@import "@/assets/_variables.scss";
@import "@/assets/styles/forms.scss";

.add-network-btn {
    margin-top: .625rem;
    width: $fullSize;
}

// Mobile version
.delete-network-btn {
    margin-top: .625rem;
}

@media screen and (min-width: $responsiveWidth) {
    #network-section {
        flex-direction: row;
        gap: .625rem;

        .q-input {
            flex-grow: 2;
            margin-bottom: .625rem;
        }

        .q-btn {
            justify-content: center;
        }

        .delete-network-btn {
            margin-top: -.001rem;
            height: 3.5rem;
        }
    }

    .add-network-btn {
        width: auto;
    }
}


</style>

