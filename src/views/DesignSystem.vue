<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'

// Table imports
import type {QTableProps} from 'quasar'
import type {Association} from '#/association'
import {useUserStore} from '@/stores/useUserStore'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import useUserAssociations from '@/composables/useUserAssociations'

enum Variant {
    Home = 'home',
    Login = 'minimal',
    Space1 = 'space-1',
    Space2 = 'space-2',
    Space3 = 'space-3',
    Space4 = 'space-4'
}

const {t} = useI18n()
const variant = ref(Variant.Space1)
const siteName = import.meta.env.VITE_APP_SITE_NAME

// Breadcrumbs data
const breadcrumbs = [
    {
        label: 'Page 1',
        to: ''
    },
    {
        label: 'Page 2',
        to: ''
    }
]

// Fields data
const fieldValue = ref<string>()
const selectValue = ref<string>()
const selectOptions = ref([
    {id: 1, label: 'Option 1'},
    {id: 2, label: 'Option 2'},
    {id: 3, label: 'Option 3'}
])

// Pagination data
const currentPage = ref(1)
const pages = ref(5)

// Header data
const mobileMenuVisible = ref(false)
function ToggleMenu() {
    mobileMenuVisible.value = !mobileMenuVisible.value
}

// Table data
const {loading} = useQuasar()
const userStore = useUserStore()
const associationStore = useAssociationStore()
const {getUserAssociations} = useUserAssociations()
const associations = ref<Association[]>()
const initValues = () => {
    associations.value = associationStore.associations
}
watch(() => associationStore.associations, initValues)
onMounted(async function () {
    loading.show()
    await associationStore.getManagedAssociations()
    if (userStore.user) {
        await getUserAssociations(userStore.user.id, false)
    }
    initValues()
    loading.hide()
})
const selected = ref<QTableProps['selected']>([])
const columns: QTableProps['columns'] = [
    {
        name: 'name',
        required: true,
        label: t('directory.labels.association-name'),
        align: 'left',
        field: row => row.name,
        format: val => `${val}`,
        sortable: true
    },
    {
        name: 'acronym',
        align: 'left',
        label: t('directory.labels.association-acronym'),
        field: 'acronym',
        sortable: true
    },
    // {
    //     name: 'institution',
    //     align: 'left',
    //     label: t('directory.labels.association-institution'),
    //     field: 'institution',
    //     sortable: true
    // },
    {
        name: 'activityField',
        align: 'left',
        label: t('directory.labels.association-activity-field'),
        field: 'activityField',
        sortable: true
    },
    {
        name: 'status',
        align: 'right',
        label: t('directory.labels.association-status'),
        field: 'isEnabled',
        sortable: true
    },
    // {
    //     name: 'public',
    //     align: 'left',
    //     label: t('directory.labels.association-public'),
    //     field: 'isPublic',
    //     sortable: true
    // },
    {
        name: 'actions',
        align: 'center',
        label: '',// t('directory.labels.association-actions'),
        field: 'actions',
        sortable: false
    },
]

</script>

<template>
    <QLayout
        id="layout-page"
        view="hHh lpR fFf"
    >
        <!-- VARIANT SELECTOR MENU - MADE FOR THIS PAGE AND NOT PART OF THE DESIGN! -->
        <menu id="design-system-menu">
            <li>
                <p>Variante</p>
            </li>
            <li>
                <button
                    :class="{ 'selected': variant === Variant.Home }"
                    @click="() => { variant = Variant.Home }"
                >
                    Home
                </button>
            </li>
            <li>
                <button
                    :class="{ 'selected': variant === Variant.Login }"
                    @click="() => { variant = Variant.Login }"
                >
                    Login
                </button>
            </li>
            <li>
                <button
                    :class="{ 'selected': variant === Variant.Space1 }"
                    @click="() => { variant = Variant.Space1 }"
                >
                    Espace annuaire
                </button>
            </li>
            <li>
                <button
                    :class="{ 'selected': variant === Variant.Space2 }"
                    @click="() => { variant = Variant.Space2 }"
                >
                    Espace charte
                </button>
            </li>
            <li>
                <button
                    :class="{ 'selected': variant === Variant.Space3 }"
                    @click="() => { variant = Variant.Space3 }"
                >
                    Espace CAPE
                </button>
            </li>
            <li>
                <button
                    :class="{ 'selected': variant === Variant.Space4 }"
                    @click="() => { variant = Variant.Space4 }"
                >
                    Espace autres
                </button>
            </li>
        </menu>

        <!-- HEADER -->
        <QHeader
            id="layout-header"
            :class="['variant-' + variant]"
        >
            <QToolbar>
                <QToolbarTitle>
                    <RouterLink
                        :to="{ name: 'Home' }"
                        class="home-link"
                    >
                        {{ siteName }}
                    </RouterLink>
                </QToolbarTitle>
                
                <div id="menu-items">
                    <button
                        id="mobile-menu-button"
                        @click="ToggleMenu"
                    >
                        <i class="bi bi-list"></i>
                    </button>
                    <span
                        id="mobile-menu-background"
                        :class="{ 'visible': mobileMenuVisible }"
                        aria-hidden="true"
                    ></span>
                    
                    <LayoutHeaderNav :class="{ 'visible': mobileMenuVisible }" />
                </div>
            </QToolbar>

            <div
                id="header-home-title"
                v-if="variant === Variant.Home"
            >
                <h2>Bienvenue sur <strong>OPALINE</strong></h2>
                <h3>Le site de la vie étudiante de l'UNISTRA</h3>
            </div>

            <div
                id="header-title"
                v-if="variant !== Variant.Home && variant !== Variant.Login"
            >
                <h1>
                    <span id="header-title-icon">
                        <i class="bi bi bi-geo-alt space-1-icon"></i>
                        <i class="bi bi-book space-2-icon"></i>
                        <i class="bi bi-send space-3-icon"></i>
                        <i class="bi bi-person space-4-icon"></i>
                    </span>
                    Ceci est le titre de la page
                </h1>
            </div>
        </QHeader>

        <!-- BREADCRUMBS -->
        <div
            id="layout-breadcrumbs"
            :class="['variant-' + variant]"
        >
            <QBreadcrumbs
                gutter="none"
                separator=""
            >
                <QBreadcrumbsEl
                    :label="t('breadcrumbs.home')"
                    :to="{ name: 'Home' }"
                />
                <QBreadcrumbsEl
                    v-for="(element, index) in breadcrumbs"
                    :key="index"
                    :label="element.label"
                    :to="element.to"
                />
            </QBreadcrumbs>
        </div>

        <QPageContainer
            id="layout-content"
            :class="['variant-' + variant]"
        >
            <main>
                <!-- PAGE INTRO (image on the left) -->
                <!-- The h2 can be replaced by another title tag as long as the "intro-title" class isn't removed. -->
                <section class="introduction image-left">
                    <div class="content">
                        <div class="intro-image">
                            <img
                                src="@/assets/img/unistra.jpg"
                                alt="Intro image"
                            />
                        </div>
                        <div>
                            <h2 class="intro-title">Ceci est un bloc d'introduction de page !</h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et
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

                <!-- PAGE INTRO (image on the right) -->
                <!-- Use the "image-right" class to put the image on the right side of the section -->
                <!-- Use the "color-background" class to add a solid color background to the section -->
                <section class="introduction image-right color-background">
                    <div class="content">
                        <div class="intro-image">
                            <img
                                src="@/assets/img/unistra.jpg"
                                alt="Intro image"
                            />
                        </div>
                        <div>
                            <h2 class="intro-title">Ceci est un bloc d'introduction de page !</h2>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et
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

                <!-- PAGE SECTION -->
                <section class="page-section">
                    <!-- TITLES -->
                    <!-- Styles are applied to the class, not the tags. Replace by the title tag that makes sense syntactically. -->
                    <h2 class="title-1">Titre de niveau 1</h2>
                    <h3 class="title-2">Titre de niveau 2</h3>
                    <h4 class="title-3">Titre de niveau 3</h4>

                    <!-- PARAGRAPH -->
                    <p class="paragraph">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                        sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>

                    <!-- PARAGRAPH WITH A FLOATING IMAGE (LEFT) -->
                    <p class="paragraph">
                        <img
                            class="float-left"
                            src="@/assets/img/unistra.jpg"
                            alt="Intro image"
                            style="width: 16rem; height: auto;"
                        />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                        sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                        sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>

                    <!-- PARAGRAPH WITH A FLOATING IMAGE (RIGHT) -->
                    <p class="paragraph">
                        <img
                            class="float-right"
                            src="@/assets/img/unistra.jpg"
                            alt="Intro image"
                            style="width: 16rem; height: auto;"
                        />
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                        sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                        sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor 
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </p>

                    <!-- UNORDERED LIST -->
                    <p class="paragraph">
                        <ul>
                            <li>Ceci est le premier élément de la liste ;</li>
                            <li>Ceci est le second ;</li>
                            <li>Et finalement, ceci est le troisième et dernier élément.</li>
                        </ul>
                    </p>

                    <!-- ORDERED LIST -->
                    <p class="paragraph">
                        <ol>
                            <li>Ceci est le premier élément de la liste ;</li>
                            <li>Ceci est le second ;</li>
                            <li>Et finalement, ceci est le troisième et dernier élément.</li>
                        </ol>
                    </p>
                </section>

                <!----> <div class="separator"></div> <!---->

                <!-- DASHBOARD SECTION -->
                <section class="dashboard-section">
                    <h2>
                        <i
                            class="bi bi-pencil-square"
                            aria-hidden="true"
                        ></i>
                        Titre de la section
                    </h2>
                    <div class="form-container">
                        <div class="form">
                        </div>
                    </div>
                </section>

                <!----> <div class="separator"></div> <!---->

                <!-- FORM TITLE -->
                <div class="form-title">
                    <h2>
                        <i
                            class="bi bi-pencil-square"
                            aria-hidden="true"
                        ></i>
                        Éléments de formulaire Quasar
                    </h2>
                </div>

                <!-- BASIC FORM CONTAINER -->
                <div class="form-container">
                    <div class="form">
                        <!-- FORM ELEMENTS -->

                        <!-- INPUT FIELD -->
                        <QInput
                            v-model="fieldValue"
                            label="Input field"
                            :rules="[val => val && val.length > 0]"
                            filled
                            lazy-rules
                        />

                        <!-- SELECT FIELD -->
                        <QSelect
                            v-model="selectValue"
                            label="Liste déroulante"
                            :options="selectOptions"
                            emit-value
                            filled
                            map-options
                            option-label="label"
                            option-value="id"
                        />

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- BASIC BUTTONS -->
                        <div class="buttons-group">
                            <QBtn label="Bouton basique" />
                            <QBtn
                                label="Bouton icône gauche"
                                icon="bi-chevron-compact-right"
                            />
                            <QBtn
                                label="Bouton icône droite"
                                icon-right="bi-chevron-compact-right"
                            />
                        </div>

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- ALT BUTTONS -->
                        <div class="buttons-group">
                            <QBtn
                                class="btn-alt"
                                label="Bouton alternatif"
                            />
                            <QBtn
                                class="btn-alt"
                                label="Bouton icône gauche"
                                icon="bi-chevron-compact-right"
                            />
                            <QBtn
                                class="btn-alt"
                                label="Bouton icône droite"
                                icon-right="bi-chevron-compact-right"
                            />
                        </div>

                        <!-- PAGINATION QUASAR -->
                        <QPagination
                            v-model="currentPage"
                            :max="pages"
                        />

                        <!-- PAGINATION CUSTOM -->
                        <div class="pagination">
                            <div class="wrapper">
                                <QBtn
                                    label=""
                                    icon="bi-chevron-compact-left"
                                />
                                <QBtn class="counter-button">Page <strong>1</strong> / 25</QBtn>
                                <QBtn
                                    label=""
                                    icon-right="bi-chevron-compact-right"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <!----> <div class="separator"></div> <!---->
                
                <!-- FORM TITLE -->
                <div class="form-title">
                    <h2>
                        <i
                            class="bi bi-pencil-square"
                            aria-hidden="true"
                        ></i>
                        Éléments de formulaire custom
                    </h2>
                </div>

                <!-- BASIC FORM CONTAINER -->
                <div class="form-container">
                    <div class="form">
                        <!-- FORM ELEMENTS -->

                        <!-- DOCUMENTS INPUT -->
                        <div class="document-input-group">
                            <div class="document-input variant-space-1">
                                <div class="document-input-header">
                                    <h4>
                                        PV de la dernière AGO
                                    </h4>
                                    <p>
                                        <button>
                                            <i class="bi bi-info-circle"></i>
                                        </button>
                                    </p>
                                    <button>
                                        <i class="bi bi-plus"></i>
                                    </button>
                                </div>
                                <div class="document-input-list">
                                    <div class="document-item">
                                        <p>
                                            <i
                                                class="bi bi-file-earmark"
                                                aria-hidden="true"
                                            ></i>
                                            <a
                                                href="/"
                                                target="_blank"
                                            >
                                                cert_scol_membre1.pdf
                                                <i
                                                    class="bi bi-eye"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </p>
                                        <button>
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div class="document-item">
                                        <p>
                                            <i
                                                class="bi bi-file-earmark"
                                                aria-hidden="true"
                                            ></i>
                                            <a
                                                href="/"
                                                target="_blank"
                                            >
                                                cert_scol_membre2.pdf
                                                <i
                                                    class="bi bi-eye"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </p>
                                        <button>
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div class="document-item">
                                        <p>
                                            <i
                                                class="bi bi-file-earmark"
                                                aria-hidden="true"
                                            ></i>
                                            <a
                                                href="/"
                                                target="_blank"
                                            >
                                                cert_scol_membre3.pdf
                                                <i
                                                    class="bi bi-eye"
                                                    aria-hidden="true"
                                                ></i>
                                            </a>
                                        </p>
                                        <button disabled>
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="document-input">
                                    <div class="document-input-header">
                                        <h4>
                                            Certificat de scolarité des membres élus (1 document par membre)
                                        </h4>
                                        <p>
                                            <button>
                                                <i class="bi bi-info-circle"></i>
                                            </button>
                                        </p>
                                        <button>
                                            <i class="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <!-- <div class="document-input-list"></div> -->
                                </div>

                                <div class="document-input">
                                    <div class="document-input-header">
                                        <h4>
                                            Certificat envoyé par le tribunal judiciaire
                                        </h4>
                                        <!-- <p>
                                            <button>
                                                <i class="bi bi-info-circle"></i>
                                            </button>
                                        </p> -->
                                        <button disabled>
                                            <i class="bi bi-plus"></i>
                                        </button>
                                    </div>
                                    <!-- <div class="document-input-list"></div> -->
                                </div>
                            </div>
                        </div>

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- INFO PANELS -->
                        <div class="info-panel">
                            <i
                                class="bi bi-exclamation-lg"
                                aria-hidden="true"
                            ></i>
                            <p>Ceci est un message d'info. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <div class="info-panel info-panel-error">
                            <i
                                class="bi bi-exclamation-lg"
                                aria-hidden="true"
                            ></i>
                            <p>Ceci est un message d'erreur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <div class="info-panel info-panel-warning">
                            <i
                                class="bi bi-exclamation-lg"
                                aria-hidden="true"
                            ></i>
                            <p>Ceci est un message d'avertissement. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- IMAGE UPLOAD FIELD -->
                        <!-- The styled wrapper is not part of the component; the component's size will adapt to its container's. -->
                        <!-- The input is hidden and needs to have a unique id for the label (the actual visual) to target it. -->
                        <div style="width: 150px;">
                            <div class="image-input">
                                <img
                                    src="@/assets/img/logo_Ariane.png"
                                    alt="current image"
                                />
                                <input
                                    id="file-input-g15er4"
                                    type="file"
                                />
                                <label for="file-input-g15er4">
                                    <i
                                        class="bi bi-pencil-square"
                                        aria-hidden="true"
                                    ></i>
                                </label>
                            </div>
                        </div>

                        <!----> <div class="separator"></div> <!---->

                        <div style="display: flex; gap: 3.5rem;">
                            <!-- STATE BADGES -->
                            <span class="form-state">
                                État 1
                                <span
                                    class="form-state-icon form-state-green"
                                    aria-hidden="true"
                                ><i class="bi bi-check"></i></span>
                            </span>

                            <span class="form-state">
                                État 2
                                <span
                                    class="form-state-icon form-state-orange"
                                    aria-hidden="true"
                                ><i class="bi bi-dash"></i></span>
                            </span>

                            <span class="form-state">
                                État 3
                                <span
                                    class="form-state-icon form-state-red"
                                    aria-hidden="true"
                                ><i class="bi bi-x"></i></span>
                            </span>
                        </div>

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- MULTI-COLUMN FORM -->
                        <div class="form-col-container">
                            <div class="form-col">
                                <!-- SECTION TITLE -->
                                <!-- Works with any title tag, use the one that makes sense syntactically. -->
                                <h3 class="section-title">
                                    <i
                                        class="bi bi-card-text"
                                        aria-hidden="true"
                                    ></i>
                                    Titre de la section
                                </h3>

                                <!-- CHAMPS TEXTE CUSTOM -->
                                <label class="custom-label">Champ texte normal :</label>
                                <input
                                    class="custom-input"
                                    type="text"
                                    value="Valeur du champ"
                                />

                                <label class="custom-label">Champ texte avec placeholder :</label>
                                <input
                                    class="custom-input"
                                    type="text"
                                    placeholder="Tapez du texte ici..."
                                />

                                <label class="custom-label">Champ texte désactivé :</label>
                                <input
                                    class="custom-input"
                                    type="text"
                                    value="Cette valeur ne pourra pas être modifiée"
                                    disabled="true"
                                />
                            </div>

                            <div class="form-col">
                                <!-- SECTION TITLE -->
                                <!-- Works with any title tag, use the one that makes sense syntactically. -->
                                <h3 class="section-title">
                                    <i
                                        class="bi bi-card-text"
                                        aria-hidden="true"
                                    ></i>
                                    Titre de la section
                                </h3>

                                <!-- LISTE DEROULANTE -->
                                <label class="custom-label">Liste déroulante :</label>
                                <select class="custom-input">
                                    <optgroup label="Groupe A">
                                        <option>Option 1</option>
                                        <option>Option 2</option>
                                        <option>Option 3</option>
                                    </optgroup>
                                    <optgroup label="Group B">
                                        <option>Option 4</option>
                                        <option>Option 5</option>
                                    </optgroup>
                                </select>

                                <!-- TEXTAREA -->
                                <label class="custom-label">Champ texte multiligne :</label>
                                <textarea class="custom-input"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!----> <div class="separator"></div> <!---->
                
                <!-- FORM TITLE -->
                <div class="form-title">
                    <h2>
                        <i
                            class="bi bi-pencil-square"
                            aria-hidden="true"
                        ></i>
                        Lignes d'affichage
                    </h2>
                </div>

                <!-- BASIC FORM CONTAINER -->
                <div class="form-container">
                    <div class="form">
                        <!-- DISPLAY ROWS -->
                        <!-- These rows can be used to display various types of data. They look like table rows but are more flexible. -->

                        <!-- This wrapper isn't part of the component: -->
                        <div style="display: flex; flex-direction: column; gap: .9375rem; margin: 1.5rem 0;">
                            <!-- BASIC ROW -->
                            <div class="display-row">
                                <p>Ligne basique contenant une seule donnée</p>
                            </div>

                            <!-- TABLE ROW -->
                            <div class="display-row space-between">
                                <p>Ligne façon tableau</p>
                                <p>Donnée 1</p>
                                <p>Donnée 2</p>
                                <p>
                                    <span class="form-state">
                                        OK
                                        <span
                                            class="form-state-icon form-state-green"
                                            aria-hidden="true"
                                        ><i class="bi bi-check"></i></span>
                                    </span>
                                </p>
                            </div>

                            <!-- KEY/VALUE PAIR -->
                            <div class="display-row">
                                <p class="row-title">Objectif visé par le projet</p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
                                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                            </div>

                            <!-- COMMENT -->
                            <div class="comment-row">
                                <p class="comment-head">
                                    <i
                                        class="bi bi-chat"
                                        aria-hidden="true"
                                    ></i>
                                    Commentaire de <span class="value">Stéphane Ehrhart</span> le <span class="value">20/09/2022</span>
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure 
                                    dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!----> <div class="separator"></div> <!---->
                
                <!-- FORM TITLE -->
                <div class="form-title">
                    <h2>
                        <i
                            class="bi bi-pencil-square"
                            aria-hidden="true"
                        ></i>
                        Tableaux admin
                    </h2>
                </div>

                <!-- BASIC FORM CONTAINER -->
                <div class="form-container">
                    <div class="form">
                        <!-- ADMIN TABLE -->
                        <!-- Use the "actions-cell-compact" class on the action button cell to use the new button design (with a transparent background). -->
                        <!-- This new design is lighter visually, and works better with taller rows. -->
                        <!-- Note: cells containing state badge need the "state-cell" class. -->
                        <QTable
                            v-model:selected="selected"
                            :columns="columns"
                            :loading="!associations"
                            :rows="associations"
                            :rows-per-page-options="[5, 10, 20, 50, 0]"
                            :title="t('directory.title')"
                            row-key="name"
                            selection="multiple"
                        >
                            <template v-slot:body="props">
                                <QTr :props="props">
                                    <QTd>
                                        <QCheckbox v-model="props.selected"/>
                                    </QTd>
                                    <QTd
                                        key="name"
                                        :props="props"
                                    >
                                        {{ props.row.name }}
                                    </QTd>
                                    <QTd
                                        key="acronym"
                                        :props="props"
                                    >
                                        {{ props.row.acronym }}
                                    </QTd>
                                    <QTd
                                        key="activityField"
                                        :props="props"
                                    >
                                        {{ props.row.activityField?.name }}
                                    </QTd>
                                    <QTd
                                        key="status"
                                        :props="props"
                                        class="state-cell"
                                    >
                                        <span
                                            v-if="!props.row.isEnabled"
                                            class="form-state"
                                        >
                                            {{ t('association.disabled') }}
                                            <span class="form-state-icon form-state-red"><i class="bi bi-x"></i></span>
                                        </span>

                                        <span
                                            v-else
                                            class="form-state"
                                        >
                                            {{ t('association.enabled') }}
                                            <span class="form-state-icon form-state-green"><i class="bi bi-check"></i></span>
                                        </span>
                                    </QTd>
                                    <QTd
                                        key="actions"
                                        :props="props"
                                        class="actions-cell-compact"
                                    >
                                        <div class="button-container">
                                            <QBtn
                                                :label="t('association.edit')"
                                                :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                                                color="primary"
                                                icon="bi-pencil"
                                            />
                                            <QBtn
                                                label="Supprimer"
                                                :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                                                color="primary"
                                                icon="bi-x-lg"
                                            />
                                        </div>
                                    </QTd>
                                </QTr>
                            </template>
                        </QTable>

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- ADMIN TABLE (NO LABEL ON BUTTONS) -->
                        <!-- Remove the "label" attribute on buttons, leaving only the icon. Useful when rows have a lot of data and normal buttons would take too much space. -->
                        <QTable
                            v-model:selected="selected"
                            :columns="columns"
                            :loading="!associations"
                            :rows="associations"
                            :rows-per-page-options="[5, 10, 20, 50, 0]"
                            :title="t('directory.title')"
                            row-key="name"
                            selection="multiple"
                        >
                            <template v-slot:body="props">
                                <QTr :props="props">
                                    <QTd>
                                        <QCheckbox v-model="props.selected"/>
                                    </QTd>
                                    <QTd
                                        key="name"
                                        :props="props"
                                    >
                                        {{ props.row.name }}
                                    </QTd>
                                    <QTd
                                        key="acronym"
                                        :props="props"
                                    >
                                        {{ props.row.acronym }}
                                    </QTd>
                                    <QTd
                                        key="activityField"
                                        :props="props"
                                    >
                                        {{ props.row.activityField?.name }}
                                    </QTd>
                                    <QTd
                                        key="status"
                                        :props="props"
                                        class="state-cell"
                                    >
                                        <span
                                            v-if="!props.row.isEnabled"
                                            class="form-state"
                                        >
                                            {{ t('association.disabled') }}
                                            <span class="form-state-icon form-state-red"><i class="bi bi-x"></i></span>
                                        </span>

                                        <span
                                            v-else
                                            class="form-state"
                                        >
                                            {{ t('association.enabled') }}
                                            <span class="form-state-icon form-state-green"><i class="bi bi-check"></i></span>
                                        </span>
                                    </QTd>
                                    <QTd
                                        key="actions"
                                        :props="props"
                                        class="actions-cell-compact"
                                    >
                                        <div class="button-container">
                                            <QBtn
                                                :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                                                color="primary"
                                                icon="bi-pencil"
                                            />
                                            <QBtn
                                                :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                                                color="primary"
                                                icon="bi-x-lg"
                                            />
                                        </div>
                                    </QTd>
                                </QTr>
                            </template>
                        </QTable>

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- ADMIN TABLE (ORIGINAL BUTTON DESIGN) -->
                        <!-- Use the "action-cell" class on the action button cell to use the old button design. -->
                        <QTable
                            v-model:selected="selected"
                            :columns="columns"
                            :loading="!associations"
                            :rows="associations"
                            :rows-per-page-options="[5, 10, 20, 50, 0]"
                            :title="t('directory.title')"
                            row-key="name"
                            selection="multiple"
                        >
                            <template v-slot:body="props">
                                <QTr :props="props">
                                    <QTd>
                                        <QCheckbox v-model="props.selected"/>
                                    </QTd>
                                    <QTd
                                        key="name"
                                        :props="props"
                                    >
                                        {{ props.row.name }}
                                    </QTd>
                                    <QTd
                                        key="acronym"
                                        :props="props"
                                    >
                                        {{ props.row.acronym }}
                                    </QTd>
                                    <QTd
                                        key="activityField"
                                        :props="props"
                                    >
                                        {{ props.row.activityField?.name }}
                                    </QTd>
                                    <QTd
                                        key="status"
                                        :props="props"
                                        class="state-cell"
                                    >
                                        <span
                                            v-if="!props.row.isEnabled"
                                            class="form-state"
                                        >
                                            {{ t('association.disabled') }}
                                            <span class="form-state-icon form-state-red"><i class="bi bi-x"></i></span>
                                        </span>

                                        <span
                                            v-else
                                            class="form-state"
                                        >
                                            {{ t('association.enabled') }}
                                            <span class="form-state-icon form-state-green"><i class="bi bi-check"></i></span>
                                        </span>
                                    </QTd>
                                    <QTd
                                        key="actions"
                                        :props="props"
                                        class="actions-cell"
                                    >
                                        <div class="button-container">
                                            <QBtn
                                                :label="t('association.edit')"
                                                :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                                                color="primary"
                                                icon="bi-pencil"
                                            />
                                            <QBtn
                                                label="Supprimer"
                                                :to="{name: 'EditAssociation', params: {id: props.row.id}}"
                                                color="primary"
                                                icon="bi-x-lg"
                                            />
                                        </div>
                                    </QTd>
                                </QTr>
                            </template>
                        </QTable>
                    </div>
                </div>

                <!-- PAGE NAVIGATION -->
                <section class="form-page-navigation">
                    <QBtn
                        label="Annuler"
                        icon="bi-x-lg"
                    />
                    <p class="paragraph">Contrôles permettant de naviguer entre des pages, par exemple entre plusieurs étapes de formulaire. Ce texte explicatif est optionnel.</p>
                    <QBtn
                        label="Étape suivante"
                        icon-right="bi-chevron-compact-right"
                    />
                </section>
            </main>
        </QPageContainer>

        <!-- FOOTER -->
        <QFooter
            id="layout-footer"
            :class="['variant-' + variant]"
            elevated
        >
            <div id="footer-logos">
                <div class="wrapper">
                    <RouterLink to="/">
                        <img src="@/assets/img/logos/uha.png" />
                    </RouterLink>
                    <RouterLink to="/">
                        <img src="@/assets/img/logos/hear-white.png" />
                    </RouterLink>
                    <RouterLink to="/">
                        <img src="@/assets/img/logos/insa.png" />
                    </RouterLink>
                    <RouterLink to="/">
                        <img src="@/assets/img/logos/ensas.png" />
                    </RouterLink>
                    <RouterLink to="/">
                        <img src="@/assets/img/logos/engees.png" />
                    </RouterLink>
                    <RouterLink to="/">
                        <img src="@/assets/img/logos/unistra.png" />
                    </RouterLink>
                </div>
            </div>
            <QToolbar>
                <div class="footer-text">
                    <RouterLink
                        class="li-footer"
                        to="/"
                    >
                        <i class="bi bi-card-text"></i>{{ t("footer.about") }}
                    </RouterLink>
                    <RouterLink
                        class="li-footer"
                        to="/"
                    >
                        <i class="bi bi-card-checklist"></i>{{ t("footer.legal-notice") }}
                    </RouterLink>
                    <RouterLink
                        class="li-footer"
                        to="/"
                    >
                        <i class="bi bi-envelope"></i>{{ t("footer.contact") }}
                    </RouterLink>
                </div>
            </QToolbar>
            <p>
                La Base de Données des Associations Etudiantes d’Alsace est un annuaire regroupant les associations étudiantes d’Alsace. 
                Ce projet est réalisé dans le cadre du Schéma Directeur de la Vie Etudiante – Alsace, qui lie les établissements d’enseignement supérieur 
                (Unistra, UHA, INSA, ENGEES, ENSAS, HEAR) et la BNU, en partenariat avec le Crous.
            </p>
            <p>{{ t("footer.copyright") }}</p>
        </QFooter>
    </QLayout>
</template>

<style lang="scss">
@import '@/assets/styles/header.scss';
@import '@/assets/styles/breadcrumbs.scss';
@import '@/assets/styles/footer.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/home.scss';
@import '@/assets/styles/dashboard.scss';
</style>

<style lang="scss" scoped>
@import '@/assets/styles/design-system.scss';
</style>
