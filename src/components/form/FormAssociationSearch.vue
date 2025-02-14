<script lang="ts" setup>
import type {Association, AssociationSearch} from '#/association'
import {ref, watch} from 'vue'
import useDirectory from '@/composables/useDirectory'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import type {RouteRecordName} from 'vue-router'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import AtomicButton from '@/components/atomic/AtomicButton.vue'
import AtomicInput from '@/components/atomic/AtomicInput.vue'
import AtomicSelect from '@/components/atomic/AtomicSelect.vue'

const {advancedSearch, simpleAssociationSearch} = useDirectory()
const {t} = useI18n()
const associationStore = useAssociationStore()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()

const props = defineProps<{
    route: RouteRecordName
}>()

const emit = defineEmits(['updatePage'])

const expanded = ref<boolean>(false)

async function getSearchOptions() {
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
}

watch(() => expanded.value, () => {
    if (expanded.value) getSearchOptions()
})

const settings = ref<AssociationSearch>({
    search: '',
    name: '',
    acronym: '',
    institution: null,
    institutionComponent: null,
    activityField: null
})

async function onSearch() {
    loading.show()
    try {
        let isPublic = true
        if (props.route === 'ManageAssociations') {
            isPublic = false
        }
        associationStore.associations = await simpleAssociationSearch(settings.value.search, isPublic)
        if (props.route === 'Associations') {
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
    loading.show()
    associations.value = advancedSearch(settings.value) as Association[] ?? associationStore.associations
    loading.hide()
}

// A function that clears the search,
// for API search it re-gets associations, for front search it looks back in store
async function clearSearch() {
    loading.show()
    try {
        settings.value = {
            search: '',
            name: '',
            acronym: '',
            institution: null,
            institutionComponent: null,
            activityField: null
        }
        if (props.route === 'Associations') {
            await associationStore.getAssociations(true)
            emit('updatePage')
        } else if (props.route === 'ManageAssociations') await associationStore.getManagedAssociations()
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
            role="search"
            @submit.prevent="onSearch"
        >
            <AtomicInput
                :label="t('search')"
                :model="settings.search"
                color="association"
                icon="bi-search"
                type="search"
                @update:model="settings.search = $event as string"
            />
            <div class="flex-row">
                <AtomicButton
                    :label="t('search')"
                    color="association"
                    icon="bi-chevron-right"
                    type="submit"
                />
                <AtomicButton
                    :label="t('cancel-search')"
                    color="association"
                    icon="bi-x-lg"
                    @click="clearSearch"
                />
            </div>
        </QForm>

        <QForm
            :aria-label="t('directory.directory-advanced')"
            role="search"
            @submit.prevent="onAdvancedSearch"
        >
            <QExpansionItem
                v-model="expanded"
                :label="t('advanced-search')"
                header-class="text-association"
            >
                <AtomicInput
                    :label="t('directory.labels.association-name')"
                    :model="settings.name"
                    color="association"
                    @update:model="settings.name = $event as string"
                />
                <AtomicInput
                    :label="t('directory.labels.association-acronym')"
                    :model="settings.acronym"
                    color="association"
                    @update:model="settings.acronym = $event as string"
                />
                <div class="flex-row-center">
                    <AtomicSelect
                        :label="t('directory.labels.association-institution')"
                        :model="settings.institution"
                        :options="associationStore.institutionLabels"
                        color="association"
                        @update:model="settings.institution = $event as number"
                    />
                    <AtomicSelect
                        :label="t('directory.labels.association-institution-component')"
                        :model="settings.institutionComponent"
                        :options="associationStore.institutionComponentLabels"
                        color="association"
                        @update:model="settings.institutionComponent = $event as number"
                    />
                    <AtomicSelect
                        :label="t('directory.labels.association-activity-field')"
                        :model="settings.activityField"
                        :options="associationStore.activityFieldLabels"
                        color="association"
                        @update:model="settings.activityField = $event as number"
                    />
                </div>

                <div class="flex-row padding-bottom">
                    <AtomicButton
                        :label="t('advanced-search')"
                        :submit="true"
                        color="association"
                        icon="bi-chevron-right"
                    />
                    <AtomicButton
                        :label="t('cancel-search')"
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
</style>
