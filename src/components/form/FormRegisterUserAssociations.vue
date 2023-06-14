<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import useAssociation from '@/composables/useAssociation'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, ref, watch} from 'vue'
import {useRoute} from 'vue-router'
import useUserAssociations from '@/composables/useUserAssociations'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

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
const {catchHTTPError} = useErrors()

onMounted(async () => {
    loading.show()
    await loadAssociations()
    initTitle()
    newAssociations.value = []
    loading.hide()
})

const title = ref<string>()

const options = ref(associationStore.associationLabels)

const routeName = ref<string>(route.name as string)
watch(() => route.name, () => {
    routeName.value = route.name as string
})

const initTitle = () => {
    if (routeName.value === 'Registration') title.value = t('dashboard.association-user.add-my-associations')
    else if (routeName.value === 'ManageAccount') title.value = t('dashboard.association-user.add-my-new-associations')
    else title.value = t('user-manager.register-in-new-associations')
}
watch(() => route.path, initTitle)

async function loadAssociations() {
    try {
        await associationStore.getAssociationNames(false, true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
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
                <legend class="title-3">{{ title }}</legend>
                <p class="paragraph">{{ t('dashboard.association-user.add-my-associations-note') }}</p>

                <div
                        v-for="(association, index) in newAssociations"
                        :key="index"
                >
                    <div class="flex-group">
                        <div>
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
                        </div>
                        <QSeparator
                                inset
                                vertical
                        />
                        <div>
                            <QBtn
                                    :label="t('forms.delete-association')"
                                    aria-label="t('forms.delete-association')"
                                    class="bg-delete"
                                    icon="bi-trash"
                                    @click="removeAssociation(index)"
                            />
                        </div>
                    </div>
                    <QSeparator
                            v-if="routeName !== 'ManageAccount'"
                    />
                    <QBtn
                            v-if="(newAssociations.length > 0 && newAssociations[0].id) &&
                            routeName === 'ManageAccount'"
                            :label="t('validate')"
                            class="validate-button"
                            icon-right="bi-check2"
                            type="submit"
                    />
                </div>
                <QBtn
                        v-if="(route.name !== 'ManageAccount' && newAssociations.length < (5 - userAssociations.length)) ||
                        (routeName === 'ManageAccount' && newAssociations.length === 0)"
                        :label="t('forms.add-association')"
                        class="add-association"
                        icon="bi-plus-circle"
                        @click="addAssociation"
                />
            </fieldset>
        </QCardSection>
    </QCard>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
@import '@/assets/_variables.scss';

.title-3 {
  font-weight: $semibold-weight;
}

.flex-group, .q-separator {
  margin: 1rem 0 1rem 0;
}

@media screen and (min-width: $responsiveWidth) {
  .q-card {
    width: $halfSize;
  }

  .flex-group {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;

    .q-separator {
      padding: 0;
      margin: 0;
    }
  }
}

</style>
