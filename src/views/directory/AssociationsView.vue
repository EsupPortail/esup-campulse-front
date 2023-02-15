<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useDirectory from '@/composables/useDirectory'
import type {Association, AssociationSearch} from '#/association'
import {useQuasar} from 'quasar'


const {advancedSearch, simpleAssociationSearch} = useDirectory()
const associationStore = useAssociationStore()
const {loading, notify} = useQuasar()
const {t} = useI18n()

onMounted(async function () {
    loading.show
    await associationStore.getAssociations(true)
    await loadAssociationsActivityFields()
    loading.hide
})

// Initialize a clone of associations from the store to do some searching and pagination
const associations = ref<Association[]>([...associationStore.associations])
watch(() => associationStore.associations, () => {
    associations.value = associationStore.associations
})

// Used for pagination
const associationsPerPage = 15
const currentPage = ref(1)
const startIndex = ref(0)
watch(() => currentPage.value, () => {
    startIndex.value = associationsPerPage * (currentPage.value - 1)
})
const pages = ref()
watch(() => associations.value.length, () => {
    pages.value = Math.ceil(associations.value.length / associationsPerPage)
})
const endIndex = ref(associations.value.length % associationsPerPage != 0 && currentPage.value === pages.value ?
    associations.value.length : currentPage.value * associationsPerPage)
watch(() => currentPage.value, () => {
    endIndex.value = associations.value.length % associationsPerPage != 0 && currentPage.value === pages.value ?
        associations.value.length : currentPage.value * associationsPerPage
})
const associationsOnPage = ref([...associations.value.slice(startIndex.value, endIndex.value)])
watch(() => associations.value, () => {
    associationsOnPage.value = associations.value.slice(startIndex.value, endIndex.value)
})
watch(() => startIndex.value, () => {
    associationsOnPage.value = associations.value.slice(startIndex.value, endIndex.value)
})
watch(() => endIndex.value, () => {
    associationsOnPage.value = associations.value.slice(startIndex.value, endIndex.value)
})

// Scroll back to search fields on top of associations
function scrollToTop() {
    const searchFields = document.getElementById('search-form') as HTMLElement
    searchFields.scrollIntoView()
}

// Used for searching
const settings = ref<AssociationSearch>({
    search: '',
    name: '',
    acronym: '',
    institution: null,
    institutionComponent: null,
    activityField: null
})

// Functions
async function loadAssociationsActivityFields() {
    try {
        await associationStore.getInstitutions()
        await associationStore.getInstitutionComponents()
        await associationStore.getActivityFields()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

async function onSearch() {
    associations.value = await simpleAssociationSearch(settings.value.search)
}

function onAdvancedSearch() {
    associations.value = advancedSearch(settings.value) as Association[]
}

// A function that clears the search,
// for API search it re-gets associations, for front search it looks back in store
async function clearSearch(apiSearch: boolean) {
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
}
</script>

<template>
    <h1>{{ t("home.directory") }}</h1>

    <section class="introduction">
        <img :alt="t('directory.image-alt')" src="/images/unistra.jpg">
        <div>
            <h2>{{ t('directory.subtitle') }}</h2>
            <p>{{ t('directory.introduction') }}</p>
        </div>
    </section>
    <section>
        <QForm
            id="search-form"
            class="search-text-field"
            @submit.prevent="onSearch"
        >
            <fieldset>
                <QInput
                    v-model="settings.search"
                    :label="t('directory.search')"
                    :placeholder="t('directory.search-placeholder')"
                    filled
                    lazy-rules
                >
                    <template v-slot:prepend>
                        <QIcon name="mdi-magnify"/>
                    </template>
                </QInput>
                <QBtn
                    :label="t('directory.search')"
                    color="primary"
                    icon="mdi-chevron-right"
                    @click="onSearch"
                />
                <QBtn
                    :label="t('directory.cancel-search')"
                    color="secondary"
                    icon="mdi-close"
                    @click="clearSearch(true)"
                />
            </fieldset>
        </QForm>
        <QForm
            class="search-text-field"
            @submit.prevent="onAdvancedSearch"
        >
            <QExpansionItem
                :label="t('directory.advanced-search')"
                expand-separator
                icon="mdi-menu-right"
            >
                <fieldset>
                    <QInput
                        v-model="settings.name"
                        :label="t('directory.labels.association-name')"
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
                        :label="t('directory.labels.association-component')"
                        :options="associationStore.componentLabels"
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
                <QBtn
                    :label="t('directory.advanced-search')"
                    color="primary"
                    icon="mdi-chevron-right"
                    type="submit"
                />
                <QBtn
                    :label="t('directory.cancel-search')"
                    color="secondary"
                    icon="mdi-close"
                    @click="clearSearch(false)"
                />
            </QExpansionItem>
        </QForm>
    </section>
    <section>
        <section class="directory-sorting">
            <section>
                <p v-if="associations.length > 0">
                    <span>{{ associations.length }}</span>
                    {{
                        associations.length > 1 ? t('directory.found-associations-plural') : t('directory.found-associations-singular')
                    }} :
                </p>
                <p v-else>{{ t('directory.no-match') }}</p>
                <p>
                    <span>{{ associationsOnPage.length }}</span>
                    {{
                        associationsOnPage.length > 1 ? t('directory.associations-on-page-plural') : t('directory.associations-on-page-singular')
                    }} :
                </p>
            </section>
        </section>

        <QCard v-for="association in associationsOnPage" :key="association.id" class="my-card">
            <RouterLink :to="{name: 'AssociationDetail', params: {id: association.id}}">
                <QCardSection>
                    <!-- Placeholder for logo -->
                    <div></div>
                    <div>
                        <h3>{{ association.name }}</h3>
                        <div class="logo">
                            <QImg
                                :alt="association.altLogo"
                                :ratio="1"
                                :src="Object.keys(association.pathLogo).length !== 0 ? association.pathLogo.list : '/images/no_logo.png'"
                            />
                        </div>
                        <ul>
                            <li v-if="association.acronym">
                                {{ t('directory.labels.association-acronym') + ' : ' }}
                                <span>{{ association.acronym }}</span>
                            </li>
                            <li v-if="association.activityField">
                                {{ t('directory.labels.association-activity-field') + ' : ' }}
                                <span>{{ association.activityField.name }}</span>
                            </li>
                            <li v-if="association.institution">
                                {{ t('directory.labels.association-institution') + ' : ' }}
                                <span>{{ association.institution.name }}</span>
                            </li>
                            <li v-if="association.institutionComponent">
                                {{ t('directory.labels.association-component') + ' : ' }}
                                <span>{{ association.institutionComponent.name }}</span>
                            </li>
                        </ul>
                    </div>
                </QCardSection>
            </RouterLink>
        </QCard>
        <QPagination
            v-if="pages && pages > 1"
            v-model="currentPage"
            :max="pages"
            @click="scrollToTop"
        />
    </section>
</template>


<style lang="sass" scoped>
.logo
    width: 100px
    height: 100px
</style>
