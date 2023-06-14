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
    if (props.route === 'ManageAssociations') isPublic = false
    associations.value = await simpleAssociationSearch(settings.value.search, isPublic)
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
    if (props.route === 'Associations') await associationStore.getAssociations(true)
    else if (props.route === 'ManageAssociations') await associationStore.getManagedAssociations()
    loading.hide()
}
</script>
<template>
    <section class="directory-search">
        <div class="form-title">
            <h3 class="title-3">{{ t('association.labels.search') }}</h3>
        </div>
        <QForm
                id="search-form"
                class="search-text-field"
                @submit.prevent="onSearch"
        >
            <fieldset>
                <QInput
                        v-model="settings.search"
                        :label="t('search')"
                        :placeholder="t('search')"
                        aria-label="t('search')"
                        clearable
                        filled
                        inputmode="search"
                        lazy-rules
                >
                    <template v-slot:prepend>
                        <QIcon name="mdi-magnify"/>
                    </template>
                </QInput>
                <QBtn
                        :label="t('search')"
                        aria-label="t('search')"
                        class="search-button"
                        icon-right="mdi-chevron-right"
                        type="submit"
                />
                <QBtn
                        :label="t('cancel-search')"
                        aria-label="t('cancel-search')"
                        class="cancel-button"
                        icon-right="mdi-close"
                        @click="clearSearch"
                />
            </fieldset>
        </QForm>

        <QForm
                id="advanced-search-form"
                class="search-text-field"
                @submit.prevent="onAdvancedSearch"
        >
            <QExpansionItem
                    :label="t('advanced-search')"
                    expand-separator
                    icon="mdi-menu-right"
            >
                <fieldset>
                    <QInput
                            v-model="settings.name"
                            :label="t('directory.labels.association-name')"
                            class="full-size"
                            clearable
                            filled
                            lazy-rules
                    />
                    <QInput
                            v-model="settings.acronym"
                            :label="t('directory.labels.association-acronym')"
                            clearable
                            filled
                            lazy-rules
                    />
                    <QSelect
                            v-model="settings.institution"
                            :label="t('directory.labels.association-institution')"
                            :options="associationStore.institutionLabels"
                            clearable
                            emit-value
                            filled
                            map-options
                    />
                    <QSelect
                            v-model="settings.institutionComponent"
                            :label="t('directory.labels.association-institution-component')"
                            :options="associationStore.institutionComponentLabels"
                            clearable
                            emit-value
                            filled
                            map-options
                    />
                    <QSelect
                            v-model="settings.activityField"
                            :label="t('directory.labels.association-activity-field')"
                            :options="associationStore.activityFieldLabels"
                            clearable
                            emit-value
                            filled
                            map-options
                    />
                </fieldset>

                <div class="buttons-group">
                    <QBtn
                            :label="t('advanced-search')"
                            class="search-button"
                            icon-right="mdi-chevron-right"
                            type="submit"
                    />
                    <QBtn
                            :label="t('cancel-search')"
                            color="primary"
                            icon-right="mdi-close"
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

.directory-search {
  padding: 1rem;
}
</style>
