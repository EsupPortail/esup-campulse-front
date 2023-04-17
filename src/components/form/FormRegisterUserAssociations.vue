<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import useAssociation from '@/composables/useAssociation'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import useUserAssociations from '@/composables/useUserAssociations'

const associationStore = useAssociationStore()
const route = useRoute()
const {
    userAssociations, newAssociations, addAssociation, removeAssociation, updateRegisterRoleInAssociation
} = useUserAssociations()
const {
    checkHasPresident,
} = useAssociation()
const {t} = useI18n()
const {notify, loading} = useQuasar()

onMounted(async () => {
    loading.show
    await loadAssociations()
    initTitle()
    newAssociations.value = []
    loading.hide
})

const title = ref<string>()

const options = ref(associationStore.associationLabels)

const initTitle = () => {
    if (route.name === 'Registration') title.value = t('dashboard.association-user.add-my-associations')
    else if (route.name === 'ManageAccount') title.value = t('dashboard.association-user.add-my-new-associations')
    else title.value = t('user-manager.register-in-new-associations')
}
watch(() => route.path, initTitle)

async function loadAssociations() {
    try {
        await associationStore.getAssociationNames(false, true)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

function filterAssociations(val: string, update: (cb: () => void) => void) {
    update(() => {
        const lower = val.toLowerCase()
        options.value = associationStore.associationLabels.filter(obj => obj.label.toLowerCase().indexOf(lower) > -1)
    })
}

function clearOptions() {
    options.value = []
}

</script>

<template>
    <QCard v-if="title">
        <QCardSection>
            <fieldset>
                <legend>{{ title }}</legend>
                <span>{{ t('dashboard.association-user.add-my-associations-note') }}</span>

                <div
                    v-for="(association, index) in newAssociations"
                    :key="index"
                >
                    <QSelect
                        v-model="association.id"
                        :label="t('forms.select-association')"
                        :options="options"
                        clearable
                        emit-value
                        fill-input
                        filled
                        hide-selected
                        input-debounce="0"
                        map-options
                        use-input
                        @filter="filterAssociations"
                        @input="clearOptions"
                        @update:model-value="checkHasPresident(association)"
                    />
                    <QOptionGroup
                        v-model="association.role"
                        :options="association.options"
                        inline
                        @update:model-value="updateRegisterRoleInAssociation"
                    />

                    <div class="btn-group">
                        <QBtn
                            :label="t('forms.delete-association')"
                            icon="mdi-minus-circle-outline"
                            @click="removeAssociation(index)"
                        />
                        <QBtn
                            v-if="newAssociations.length > 0 && newAssociations[0].id"
                            :label="t('validate')"
                            class="validate-button"
                            icon-right="bi-check2"
                            type="submit"
                        />
                    </div>
                    <QSeparator/>
                </div>
                <QBtn
                    v-if="newAssociations.length < (5 - userAssociations.length)"
                    :label="t('forms.add-association')"
                    class="add-association"
                    icon="mdi-plus-circle-outline"
                    @click="addAssociation"
                />
            </fieldset>
        </QCardSection>
    </QCard>
</template>

<style lang="scss">
@import "@/assets/styles/forms.scss";
@import "@/assets/_variables.scss";

.q-card {
    margin-bottom: 1rem;
}

legend {
    font-weight: $semibold-weight;
    font-size: 1.5rem;
}

.add-association {
    margin-top: 1rem;
    display: flex;
}

.back-btn {
    margin: 0;
}

@media screen and (min-width: $responsiveWidth) {
    .btn-group {
        margin: 0;
        justify-content: flex-start;
    }
}
</style>
