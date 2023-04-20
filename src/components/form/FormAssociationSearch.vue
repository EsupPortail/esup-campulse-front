<script lang="ts" setup>
import {Association, AssociationSearch} from '#/association'
import {ref, watch} from 'vue'
import useDirectory from '@/composables/useDirectory'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from 'vue-i18n'
import useAssociation from '@/composables/useAssociation'
import {useQuasar} from 'quasar'

const {advancedSearch, simpleAssociationSearch} = useDirectory()
const {t} = useI18n()
const associationStore = useAssociationStore()
const {associations} = useAssociation()
const {loading} = useQuasar()


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
    associations.value = await simpleAssociationSearch(settings.value.search)
    loading.hide()
}

function onAdvancedSearch() {
    loading.show()
    associations.value = advancedSearch(settings.value) as Association[]
    loading.hide()
}

// A function that clears the search,
// for API search it re-gets associations, for front search it looks back in store
async function clearSearch(apiSearch: boolean) {
    loading.show()
    settings.value = {
        search: '',
        name: '',
        acronym: '',
        institution: null,
        institutionComponent: null,
        activityField: null
    }
    if (apiSearch) {
        await associationStore.getAssociations(true)
    } else {
        associations.value = associationStore.associations
    }
    loading.hide()
}
</script>
<template>
    <section class="directory-search">
        <h3 class="title-3">{{ t('association.labels.search') }}</h3>
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
                    filled
                    lazy-rules
                >
                    <template v-slot:prepend>
                        <QIcon name="mdi-magnify"/>
                    </template>
                </QInput>
                <QBtn
                    :label="t('search')"
                    class="search-button"
                    color="primary"
                    icon-right="mdi-chevron-right"
                    type="submit"
                />
                <QBtn
                    :label="t('cancel-search')"
                    color="secondary"
                    icon-right="mdi-close"
                    @click="clearSearch(true)"
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
                        filled
                        lazy-rules
                    />
                    <QInput
                        v-model="settings.acronym"
                        :label="t('directory.labels.association-acronym')"
                        filled
                        lazy-rules
                    />
                    <QSelect
                        v-model="settings.institution"
                        :label="t('directory.labels.association-institution')"
                        :options="associationStore.institutionLabels"
                        emit-value
                        filled
                        map-options
                    />
                    <QSelect
                        v-model="settings.institutionComponent"
                        :label="t('directory.labels.association-institution-component')"
                        :options="associationStore.institutionComponentLabels"
                        emit-value
                        filled
                        map-options
                    />
                    <QSelect
                        v-model="settings.activityField"
                        :label="t('directory.labels.association-activity-field')"
                        :options="associationStore.activityFieldLabels"
                        emit-value
                        filled
                        map-options
                    />
                </fieldset>

                <div class="buttons-group">
                    <QBtn
                        :label="t('advanced-search')"
                        class="search-button"
                        color="primary"
                        icon-right="mdi-chevron-right"
                        type="submit"
                    />
                    <QBtn
                        :label="t('cancel-search')"
                        color="secondary"
                        icon-right="mdi-close"
                        @click="clearSearch(false)"
                    />
                </div>
            </QExpansionItem>
        </QForm>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
</style>
