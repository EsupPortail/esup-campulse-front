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
import type {AssociationRole} from '#/user'
import useDocumentUploads from '@/composables/useDocumentUploads'

const associationStore = useAssociationStore()
const route = useRoute()
const {
    userAssociations, newAssociations, addAssociation, removeAssociation, updateRegisterRoleInAssociation
} = useUserAssociations()
const {
    checkHasPresident,
} = useAssociation()
const {processDocuments} = useDocumentUploads()
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
                message: catchHTTPError(error.response)
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

function checkAssociationAuthorization(association: AssociationRole) {
    updateRegisterRoleInAssociation()
    checkHasPresident(association)
    // Commented since all local students must upload a student card
    //checkHasStudentCertificate(association)
}

async function addAssociationFocus() {
    await addAssociation()
    document.querySelectorAll('.new-association')[document.querySelectorAll('.new-association').length - 1].querySelector('input')?.focus()
}

watch(() => processDocuments.value[0]?.pathFile, () => {
    newAssociations.value.forEach(association => {
        checkAssociationAuthorization(association)
    })
})

</script>

<template>
    <QCard v-if="title">
        <QCardSection class="flex-column">
            <h3>{{ title }}</h3>
            <p>{{ t('dashboard.association-user.add-my-associations-note') }}</p>

            <div
                v-for="(association, index) in newAssociations"
                :key="index"
                class="flex-row new-association"
            >
                <div>
                    <div class="flex-column">
                        <QSelect
                            v-model="association.id"
                            :label="t('forms.select-association')"
                            :options="options"
                            clearable
                            color="dashboard"
                            emit-value
                            fill-input
                            filled
                            hide-selected
                            input-debounce="0"
                            map-options
                            use-input
                            @filter="filterAssociations"
                            @input="clearOptions"
                            @update:model-value="checkAssociationAuthorization(association)"
                        />
                        <QOptionGroup
                            v-model="association.role"
                            :options="association.options"
                            aria-label="t('forms.association-role')"
                            color="dashboard"
                            inline
                            role="radiogroup"
                            @update:model-value="updateRegisterRoleInAssociation"
                        />
                        <QSeparator
                            v-if="routeName !== 'ManageAccount'"
                            aria-hidden="true"
                        />
                    </div>
                </div>
                <QSeparator
                    aria-hidden="true"
                    inset
                    vertical
                />
                <div>
                    <QBtn
                        :aria-label="t('forms.delete-association')"
                        class="btn-lg"
                        color="custom-red"
                        icon="bi-trash"
                        outline
                        @click="removeAssociation(index)"
                    />
                </div>
            </div>

            <div class="flex-row">
                <QBtn
                    v-if="(newAssociations.length > 0 && newAssociations[0].id) &&
                        routeName === 'ManageAccount'"
                    :label="t('validate')"
                    class="btn-lg"
                    color="dashboard"
                    icon="bi-check2"
                    outline
                    type="submit"
                />
                <QBtn
                    v-if="(route.name !== 'ManageAccount' && newAssociations.length < (5 - userAssociations.length)) ||
                        (routeName === 'ManageAccount' && newAssociations.length === 0)"
                    :label="t('forms.add-association')"
                    class="btn-lg"
                    color="dashboard"
                    icon="bi-plus-circle"
                    outline
                    @click="addAssociationFocus"
                />
            </div>
        </QCardSection>
    </QCard>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
@import '@/assets/_variables.scss';
</style>
