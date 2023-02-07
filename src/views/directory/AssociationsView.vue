<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useDirectory from '@/composables/useDirectory'
import type {AssociationList, AssociationSearch} from '#/association'
import {useQuasar} from 'quasar'


const {advancedSearch} = useDirectory()
const {simpleAssociationSearch} = useDirectory()
const associationStore = useAssociationStore()
const {loading, notify} = useQuasar()
const {t} = useI18n()

onMounted(async function () {
    loading.show
    await associationStore.getAssociations(true, false)
    await loadAssociationsFields()
    loading.hide
})

// Initialize a clone of associations from the store to do some searching and pagination
const associations = ref<AssociationList[]>([...associationStore.associations])
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
const endIndex = ref(associations.value.length % 15 != 0 && currentPage.value === pages.value ?
    associations.value.length : currentPage.value * associationsPerPage)
watch(() => currentPage.value, () => {
    endIndex.value = associations.value.length % 15 != 0 && currentPage.value === pages.value ?
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
async function loadAssociationsFields() {
    try {
        await associationStore.getInstitutions()
        await associationStore.getComponents()
        await associationStore.getFields()
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
    associations.value = advancedSearch(settings.value) as AssociationList[]
}
</script>

<template>
    <!-- <h1>{{ t("home.directory") }}</h1> -->

    <section class="introduction">
        <div class="intro-image">
            <img :alt="t('directory.image-alt')" src="/images/unistra.jpg" />
        </div>
        <div>
            <h2>{{ t('directory.subtitle') }}</h2>
            <!-- <p>{{ t('directory.introduction') }}</p> -->
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
                dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non 
                proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
        </div>
    </section>
    <section class="directory-search">
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
                    icon-right="mdi-chevron-right"
                    @click="onSearch"
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
                        filled
                        lazy-rules
                        class="full-size"
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
                        :label="t('directory.labels.association-field')"
                        :options="associationStore.fieldLabels"
                        emit-value
                        filled
                        map-options
                    />
                </fieldset>
                <QBtn
                    :label="t('directory.advanced-search')"
                    color="primary"
                    icon-right="mdi-chevron-right"
                    type="submit"
                />
            </QExpansionItem>
        </QForm>
    </section>
    <section class="directory-list">
        <div class="form-container">
            <div class="form">

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
                    <div class="card-background"></div>
                    <i class="card-chevron bi bi-chevron-compact-right"></i>
                    <RouterLink :to="{name: 'AssociationDetail', params: {id: association.id}}">
                        <QCardSection>
                            <!-- Placeholder for logo -->
                            <div class="list-logo">
                                <QImg
                                    :alt="association.altLogo"
                                    :ratio="1"
                                    src="/images/no_logo.png"
                                />
                            </div>
                            <div>
                                <h3>{{ association.name }}</h3>
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
                                        <span class="value">{{ association.institution.name }}</span>
                                    </li>
                                    <li v-if="association.activityField">
                                        <span class="label">
                                            <i class="bi bi-globe"></i>
                                            {{ t('directory.labels.association-field') + ' : ' }}
                                        </span>
                                        <span class="value">{{ association.activityField.name }}</span>
                                    </li>
                                    <li v-if="association.institutionComponent">
                                        <span class="label">
                                            <i class="bi bi-mortarboard"></i>
                                            {{ t('directory.labels.association-component') + ' : ' }}
                                        </span>
                                        <span class="value">{{ association.institutionComponent.name }}</span>
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

            </div>
        </div>
    </section>
</template>

