<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useDirectory from '@/composables/useDirectory'
import useAssociation from '@/composables/useAssociation'
import type {Association, AssociationSearch} from '#/association'
import {useQuasar} from 'quasar'
import * as noLogoSquare from '@/assets/img/no_logo_square.png'

const {advancedSearch, simpleAssociationSearch} = useDirectory()
const associationStore = useAssociationStore()
const {altLogoText} = useAssociation()
const {loading, notify} = useQuasar()
const {t} = useI18n()

onMounted(async function () {
    loading.show()
    await associationStore.getAssociations(true)
    await loadAssociationsActivityFields()
    loading.hide()
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
const pages = ref(Math.ceil(associations.value.length / associationsPerPage))
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
    <!-- <h1>{{ t("home.directory") }}</h1> -->
    <section class="introduction-section">
        <div class="content">
            <div class="intro-image">
                <img
                    :alt="t('directory.image-alt')"
                    src="@/assets/img/unistra.jpg"
                />
            </div>
            <div>
                <h2 class="intro-title">{{ t('directory.subtitle') }}</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et
                    dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat. Duis aute irure
                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                    sint
                    occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        </div>
    </section>
    <section class="directory-search">
        <h2>{{ t('directory.search-association') }}</h2>
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
                    class="search-button"
                    color="primary"
                    icon-right="mdi-chevron-right"
                    type="submit"
                />
                <QBtn
                    :label="t('directory.cancel-search')"
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
                :label="t('directory.advanced-search')"
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
                        :label="t('directory.advanced-search')"
                        class="search-button"
                        color="primary"
                        icon-right="mdi-chevron-right"
                        type="submit"
                    />
                    <QBtn
                        :label="t('directory.cancel-search')"
                        color="secondary"
                        icon-right="mdi-close"
                        @click="clearSearch(false)"
                    />
                </div>
            </QExpansionItem>
        </QForm>
    </section>

    <section class="directory-list">
        <div class="form-container">
            <div class="form">
                <section class="directory-sorting">
                    <h2>{{ t('directory.list') }}</h2>
                    <div>
                        <p v-if="associations.length > 0">
                            <span>{{ associations.length }}</span>
                            {{
                                associations.length > 1 ? t('directory.found-associations-plural') :
                                t('directory.found-associations-singular')
                            }} :
                        </p>
                        <p v-else>{{ t('directory.no-match') }}</p>
                        <p>
                            <span>{{ associationsOnPage.length }}</span>
                            {{
                                associationsOnPage.length > 1 ? t('directory.associations-on-page-plural') :
                                t('directory.associations-on-page-singular')
                            }} :
                        </p>
                    </div>
                </section>

                <QCard
                    v-for="association in associationsOnPage"
                    :key="association.id"
                    class="my-card"
                >
                    <div class="card-background"></div>
                    <i class="card-chevron bi bi-chevron-compact-right"></i>
                    <!-- <RouterLink :to="{name: 'AssociationDetail', params: {id: association.id}}"> -->
                    <QCardSection>
                        <div class="list-logo">
                            <QImg
                                :alt="altLogoText(association)"
                                :ratio="1"
                                :src="association.pathLogo ? (Object.keys(association.pathLogo).length !== 0 ? association.pathLogo.list : noLogoSquare.default) : noLogoSquare.default"
                            />
                        </div>
                        <div class="list-details">
                            <h3>
                                <RouterLink :to="{name: 'AssociationDetail', params: {id: association.id}}">
                                    {{ association.name }}
                                </RouterLink>
                            </h3>
                            <ul>
                                <li v-if="association.acronym">
                                    <span class="label">
                                        <i class="bi bi-tag"></i>
                                        {{ t('directory.labels.association-acronym') + ' : ' }}
                                    </span>
                                    <span class="value">{{ association.acronym }}</span>
                                </li>
                                <li v-if="association.institution">
                                    <span class="label">
                                        <i class="bi bi-bank2"></i>
                                        {{ t('directory.labels.association-institution') + ' : ' }}
                                    </span>
                                    <span class="value">{{ associationStore.institutions.find(obj => obj.id === association?.institution)?.name }}</span>
                                </li>
                                <li v-if="association.activityField">
                                    <span class="label">
                                        <i class="bi bi-globe"></i>
                                        {{ t('directory.labels.association-activity-field') + ' : ' }}
                                    </span>
                                    <span class="value">{{ associationStore.activityFields.find(obj => obj.id === association?.activityField)?.name }}</span>
                                </li>
                                <li v-if="association.institutionComponent">
                                    <span class="label">
                                        <i class="bi bi-mortarboard"></i>
                                        {{ t('directory.labels.association-institution-component') + ' : ' }}
                                    </span>
                                    <span class="value">{{ associationStore.institutionComponents.find(obj => obj.id === association?.institutionComponent)?.name }}</span>
                                </li>
                            </ul>
                        </div>
                    </QCardSection>
                    <!-- </RouterLink> -->
                </QCard>
                <QPagination
                    v-if="associationsOnPage && pages && pages > 1"
                    v-model="currentPage"
                    :max="pages"
                    @update:model-value="scrollToTop"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
</style>
