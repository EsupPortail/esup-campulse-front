<script lang="ts" setup>
import type {AssociationSearch} from '#/association'
import {onMounted, ref, watch} from 'vue'
import useDirectory from '@/composables/useDirectory'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from 'vue-i18n'
import useAssociation from '@/composables/useAssociation'
import {useQuasar} from 'quasar'
import axios from 'axios'
import {useRoute} from 'vue-router'
import useErrors from '@/composables/useErrors'
import router from '@/router'

const {advancedSearch, simpleAssociationSearch} = useDirectory()
const {t} = useI18n()
const associationStore = useAssociationStore()
const {associations} = useAssociation()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const route = useRoute()

const emit = defineEmits(['updatePage'])

watch(() => associationStore.associations, () => {
    associations.value = associationStore.associations
})

const expanded = ref<boolean>(false)

const settings = ref<AssociationSearch>({
    search: '',
    name: '',
    acronym: '',
    institution: null,
    institutionComponent: null,
    activityField: null
})

onMounted(() => {
    settings.value.search = route.query.search as string || ''

    if (settings.value.search) {
        onSearch()
    }

    settings.value.name = route.query.name as string || ''
    settings.value.acronym = route.query.acronym as string || ''
    settings.value.institution = Number.parseInt(route.query.institution as string) || null
    settings.value.institutionComponent = Number.parseInt(route.query.component as string) || null
    settings.value.activityField = Number.parseInt(route.query.field as string) || null

    if (settings.value.name || settings.value.acronym || settings.value.institution
      || settings.value.institutionComponent || settings.value.activityField) {
        expanded.value = true
        onAdvancedSearch()
    }
})

async function getLabels() {
    loading.show()
    try {
        await associationStore.getInstitutions()
        await associationStore.getInstitutionComponents()
        await associationStore.getActivityFields()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

watch(expanded, () => {
    if (expanded.value) {
        getLabels()
    }
})

function updateQueries() {
    router.replace({
        query: {
            search: settings.value.search || undefined,
            name: settings.value.name || undefined,
            acronym: settings.value.acronym || undefined,
            institution: settings.value.institution?.toString() || undefined,
            component: settings.value.institutionComponent?.toString() || undefined,
            field: settings.value.activityField?.toString() || undefined
        }
    })
}

async function onSearch() {
    loading.show()
    updateQueries()
    try {
        const isPublic = route.name !== 'ManageAssociations'
        associations.value = await simpleAssociationSearch(settings.value.search, isPublic)
        if (route.name === 'Associations') {
            emit('updatePage')
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}

function onAdvancedSearch() {
    updateQueries()
    associations.value = advancedSearch(settings.value)
}

// A function that clears the search,
// for API search it re-gets associations, for front search it looks back in store
async function clearSearch() {
    loading.show()
    settings.value = {
        search: '',
        name: '',
        acronym: '',
        institution: null,
        institutionComponent: null,
        activityField: null
    }
    updateQueries()
    try {
        if (route.name === 'Associations') {
            await associationStore.getAssociations(true)
            emit('updatePage')
        } else if (route.name === 'ManageAssociations') {
            await associationStore.getManagedAssociations()
        }
        associations.value = associationStore.associations
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: await catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}
</script>
<template>
    <section class="container flex-column padding-bottom">
        <h3>{{ t('association.labels.search') }}</h3>
        <QForm
            id="search-form"
            :aria-label="t('directory.directory')"
            class="search-text-field"
            role="search"
            @submit.prevent="onSearch"
        >
            <div>
                <QInput
                    v-model="settings.search"
                    :label="t('search')"
                    :placeholder="t('search')"
                    clearable
                    color="association"
                    filled
                    inputmode="search"
                    lazy-rules
                >
                    <template v-slot:prepend>
                        <QIcon name="bi-search"/>
                    </template>
                </QInput>
                <div class="flex-row padding-top align-items-stretch">
                    <QBtn
                        :label="t('search')"
                        class="btn-lg"
                        color="association"
                        icon="bi-chevron-right"
                        type="submit"
                    />
                    <QBtn
                        :label="t('cancel-search')"
                        class="btn-lg"
                        color="association"
                        icon="bi-x-lg"
                        @click="clearSearch"
                    />
                </div>
            </div>
        </QForm>

        <QForm
            :aria-label="t('directory.directory-advanced')"
            class="search-text-field"
            role="search"
            @submit.prevent="onAdvancedSearch"
        >
            <QExpansionItem
                v-model="expanded"
                :label="t('advanced-search')"
                header-class="text-association"
            >
                <div class="flex-column">
                    <QInput
                        v-model="settings.name"
                        :label="t('directory.labels.association-name')"
                        class="full-size"
                        clearable
                        color="association"
                        filled
                        lazy-rules
                    />
                    <QInput
                        v-model="settings.acronym"
                        :label="t('directory.labels.association-acronym')"
                        clearable
                        color="association"
                        filled
                        lazy-rules
                    />
                    <div class="flex-row-center">
                        <QSelect
                            v-model="settings.institution"
                            :label="t('directory.labels.association-institution')"
                            :options="associationStore.institutionLabels"
                            clearable
                            color="association"
                            emit-value
                            filled
                            map-options
                        />
                        <QSelect
                            v-model="settings.institutionComponent"
                            :label="t('directory.labels.association-institution-component')"
                            :options="associationStore.institutionComponentLabels"
                            clearable
                            color="association"
                            emit-value
                            filled
                            map-options
                        />
                        <QSelect
                            v-model="settings.activityField"
                            :label="t('directory.labels.association-activity-field')"
                            :options="associationStore.activityFieldLabels"
                            clearable
                            color="association"
                            emit-value
                            filled
                            map-options
                        />
                    </div>
                </div>

                <div class="flex-row padding-top padding-bottom align-items-stretch">
                    <QBtn
                        :label="t('advanced-search')"
                        class="btn-lg"
                        color="association"
                        icon="bi-chevron-right"
                        type="submit"
                    />
                    <QBtn
                        :label="t('cancel-search')"
                        class="btn-lg"
                        color="association"
                        icon="bi-x-lg"
                        @click="clearSearch"
                    />
                </div>
            </QExpansionItem>
        </QForm>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/forms.scss';
@import "@/assets/_variables.scss";

.flex-row-center > * {
  width: $fullSize;
}
</style>
