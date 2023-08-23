<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useAssociation from '@/composables/useAssociation'
import {useQuasar} from 'quasar'
import * as noLogoSquare from '@/assets/img/no_logo_square.png'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import FormAssociationSearch from '@/components/form/FormAssociationSearch.vue'
import {useRoute} from 'vue-router'

const associationStore = useAssociationStore()
const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()
const {associations} = useAssociation()
const route = useRoute()

onMounted(async function () {
    loading.show()
    await associationStore.getAssociations(true)
    associations.value = associationStore.associations
    await loadAssociationsActivityFields()
    loading.hide()
})

const baseUrl = import.meta.env.VITE_APP_BASE_URL
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
    const searchFields = document.querySelector('#search-form') as HTMLElement
    searchFields.scrollIntoView()
    const element = document.querySelector('.directory-sorting + div a:first-child')
    if (element) (element as HTMLAnchorElement).focus()
}

// Functions
async function loadAssociationsActivityFields() {
    try {
        await associationStore.getInstitutions()
        await associationStore.getInstitutionComponents()
        await associationStore.getActivityFields()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

</script>

<template>
    <section class="dashboard-section">
        <div class="introduction-section">
            <div class="content">
                <div class="intro-image">
                    <img
                        :alt="t('directory.image-alt')"
                        src="@/assets/img/unistra.jpg"
                    />
                </div>
                <div>
                    <h2>{{ t('directory.subtitle') }}</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore
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
        </div>

        <div class="association-search">
            <FormAssociationSearch
                v-if="route.name"
                :route="route.name"
            />
        </div>

        <div class="directory-list">
            <div class="dashboard-section-container">
                <div class="container">
                    <div class="directory-sorting">
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
                    </div>

                    <QCard
                        v-for="association in associationsOnPage"
                        :key="association.id"
                        class="my-card"
                    >
                        <div class="card-background"></div>
                        <i
                            aria-hidden="true"
                            class="card-chevron bi bi-chevron-compact-right"
                        ></i>
                        <!-- <RouterLink :to="{name: 'AssociationDetail', params: {id: association.id}}"> -->
                        <QCardSection>
                            <div class="list-logo">
                                <QImg
                                    :src="association.pathLogo ?
                                        (Object.keys(association.pathLogo).length !== 0 ?
                                            (!association.pathLogo.list?.startsWith('http') ?
                                                baseUrl + association.pathLogo.list : association.pathLogo.list) :
                                            noLogoSquare.default) : noLogoSquare.default"
                                    aria-hidden="true"
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
                                            <i
                                                aria-hidden="true"
                                                class="bi bi-tag"
                                            ></i>
                                            {{ t('directory.labels.association-acronym') + ' : ' }}
                                        </span>
                                        <span class="value">{{ association.acronym }}</span>
                                    </li>
                                    <li v-if="association.institution">
                                        <span class="label">
                                            <i
                                                aria-hidden="true"
                                                class="bi bi-bank2"
                                            ></i>
                                            {{ t('directory.labels.association-institution') + ' : ' }}
                                        </span>
                                        <span class="value">{{
                                            associationStore.institutions.find(obj => obj.id === association?.institution)?.name
                                        }}</span>
                                    </li>
                                    <li v-if="association.activityField">
                                        <span class="label">
                                            <i
                                                aria-hidden="true"
                                                class="bi bi-globe"
                                            ></i>
                                            {{ t('directory.labels.association-activity-field') + ' : ' }}
                                        </span>
                                        <span class="value">{{
                                            associationStore.activityFields.find(obj => obj.id === association?.activityField)?.name
                                        }}</span>
                                    </li>
                                    <li v-if="association.institutionComponent">
                                        <span class="label">
                                            <i
                                                aria-hidden="true"
                                                class="bi bi-mortarboard"
                                            ></i>
                                            {{ t('directory.labels.association-institution-component') + ' : ' }}
                                        </span>
                                        <span class="value">{{
                                            associationStore.institutionComponents.find(obj => obj.id === association?.institutionComponent)?.name
                                        }}</span>
                                    </li>
                                </ul>
                            </div>
                        </QCardSection>
                        <!-- </RouterLink> -->
                    </QCard>
                    <div class="flex-row-center">
                        <QPagination
                            v-if="associationsOnPage && pages && pages > 1"
                            v-model="currentPage"
                            :aria-label="t('pagination')"
                            :max="pages"
                            @update:model-value="scrollToTop"
                        />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
@import '@/assets/styles/dashboard.scss';
</style>
