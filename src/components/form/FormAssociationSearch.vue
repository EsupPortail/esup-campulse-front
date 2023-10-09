<script lang="ts" setup>
import type {Association, AssociationSearch} from '#/association'
import {ref, watch} from 'vue'
import useDirectory from '@/composables/useDirectory'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from 'vue-i18n'
import useAssociation from '@/composables/useAssociation'
import {useQuasar} from 'quasar'
import type {RouteRecordName} from 'vue-router'

const {advancedSearch, simpleAssociationSearch} = useDirectory()
const {t} = useI18n()
const associationStore = useAssociationStore()
const {associations} = useAssociation()
const {loading} = useQuasar()

const props = defineProps<{
    route: RouteRecordName
}>()

const emit = defineEmits(['updatePage'])

watch(() => associationStore.associations, () => {
    associations.value = associationStore.associations
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
    let isPublic = true
    if (props.route === 'ManageAssociations') {
        isPublic = false
    }
    associations.value = await simpleAssociationSearch(settings.value.search, isPublic)
    if (props.route === 'Associations') {
        emit('updatePage')
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
