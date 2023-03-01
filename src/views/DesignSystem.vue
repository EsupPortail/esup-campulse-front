<script lang="ts" setup>
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
import LayoutHeaderNav from '@/components/layout/LayoutHeaderNav.vue'

enum Variant {
    Home = "home",
    Login = "minimal",
    Space1 = "space-1",
    Space2 = "space-2",
    Space3 = "space-3"
}

const { t } = useI18n()
const variant = ref(Variant.Space1);
const breadcrumbs = [
    {
        label: 'Page 1',
        to: ''
    },
    {
        label: 'Page 2',
        to: ''
    }
];
const fieldValue = ref<string>();
const selectValue = ref<string>();
const selectOptions = ref([
{ id: 1, label: 'Option 1' },
{ id: 2, label: 'Option 2' },
{ id: 3, label: 'Option 3' }
])

</script>

<template>
    <QLayout id="layout-page" view="hHh lpR fFf">

        <!-- VARIANT SELECTOR MENU - MADE FOR THIS PAGE AND NOT PART OF THE DESIGN! -->
        <menu id="design-system-menu">
            <li>
                <p>Variante :</p>
            </li>
            <li>
                <button :class="{ 'selected': variant === Variant.Home }"
                    @click="() => { variant = Variant.Home }">Home</button>
            </li>
            <li>
                <button :class="{ 'selected': variant === Variant.Login }"
                    @click="() => { variant = Variant.Login }">Login</button>
            </li>
            <li>
                <button :class="{ 'selected': variant === Variant.Space1 }"
                    @click="() => { variant = Variant.Space1 }">Espace annuaire</button>
            </li>
            <li>
                <button :class="{ 'selected': variant === Variant.Space2 }"
                    @click="() => { variant = Variant.Space2 }">Espace charte</button>
            </li>
            <li>
                <button :class="{ 'selected': variant === Variant.Space3 }"
                    @click="() => { variant = Variant.Space3 }">Espace CAPE</button>
            </li>
        </menu>

        <!-- HEADER -->
        <QHeader id="layout-header" :class="['variant-' + variant]">
            <QToolbar>
                <QToolbarTitle>
                    <RouterLink :to="{ name: 'Home' }" class="home-link">{{ t("header.title") }}</RouterLink>
                </QToolbarTitle>
                <LayoutHeaderNav />
            </QToolbar>

            <div id="header-home-title" v-if="variant === Variant.Home">
                <h2>Bienvenue sur <strong>OPALINE</strong></h2>
                <h3>Le site de la vie étudiante de l'UNISTRA</h3>
            </div>

            <div id="header-title" v-if="variant !== Variant.Home && variant !== Variant.Login">
                <h1>
                    <span id="header-title-icon">
                        <i class="bi bi-geo-alt space-1-icon"></i>
                        <i class="bi bi-book space-2-icon"></i>
                        <i class="bi bi-send space-3-icon"></i>
                    </span>
                    Ceci est le titre de la page
                </h1>
            </div>
        </QHeader>

        <!-- BREADCRUMBS -->
        <div id="layout-breadcrumbs" :class="['variant-' + variant]">
            <QBreadcrumbs gutter="none" separator="">
                <QBreadcrumbsEl :label="t('breadcrumbs.home')" :to="{ name: 'Home' }" />
                <QBreadcrumbsEl v-for="(element, index) in breadcrumbs" :key="index" :label="element.label"
                    :to="element.to" />
            </QBreadcrumbs>
        </div>

        <QPageContainer id="layout-content" :class="['variant-' + variant]">
            <main>

                <!-- PAGE INTRO (image on the left) -->
                <section class="introduction image-left">
                    <div class="intro-image">
                        <img alt="Intro image" src="/images/unistra.jpg" />
                    </div>
                    <div>
                        <h2>Ceci est un bloc d'introduction de page !</h2>
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
                </section>

                <!-- PAGE INTRO (image on the right) -->
                <section class="introduction image-right">
                    <div class="intro-image">
                        <img alt="Intro image" src="/images/unistra.jpg" />
                    </div>
                    <div>
                        <h2>Ceci est un bloc d'introduction de page !</h2>
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
                </section>

                <!-- DASHBOARD SECTION -->
                <section class="dashboard-section">
                    <h2>
                        <i class="bi bi-pencil-square" aria-hidden="true"></i>
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
                        <i class="bi bi-pencil-square" aria-hidden="true"></i>
                        Éléments de formulaire Quasar
                    </h2>
                </div>

                <!-- BASIC FORM CONTAINER -->
                <div class="form-container">
                    <div class="form">

                        <!-- FORM ELEMENTS -->

                        <!-- INPUT FIELD -->
                        <QInput v-model="fieldValue" label="Input field" :rules="[val => val && val.length > 0]" filled lazy-rules />

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
                            <QBtn label="Bouton icône gauche" icon="bi-chevron-compact-right" />
                            <QBtn label="Bouton icône droite" icon-right="bi-chevron-compact-right" />
                        </div>

                        <!----> <div class="separator-small"></div> <!---->

                        <!-- ALT BUTTONS -->
                        <div class="buttons-group">
                            <QBtn class="btn-alt" label="Bouton alternatif" />
                            <QBtn class="btn-alt" label="Bouton icône gauche" icon="bi-chevron-compact-right" />
                            <QBtn class="btn-alt" label="Bouton icône droite" icon-right="bi-chevron-compact-right" />
                        </div>

                    </div>
                </div>

                <!----> <div class="separator"></div> <!---->
                
                <!-- FORM TITLE -->
                <div class="form-title">
                    <h2>
                        <i class="bi bi-pencil-square" aria-hidden="true"></i>
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
                                            <i class="bi bi-file-earmark" aria-hidden="true"></i>
                                            <a href="/" target="_blank">
                                                cert_scol_membre1.pdf
                                                <i class="bi bi-eye" aria-hidden="true"></i>
                                            </a>
                                        </p>
                                        <button>
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div class="document-item">
                                        <p>
                                            <i class="bi bi-file-earmark" aria-hidden="true"></i>
                                            <a href="/" target="_blank">
                                                cert_scol_membre2.pdf
                                                <i class="bi bi-eye" aria-hidden="true"></i>
                                            </a>
                                        </p>
                                        <button>
                                            <i class="bi bi-x-lg"></i>
                                        </button>
                                    </div>
                                    <div class="document-item">
                                        <p>
                                            <i class="bi bi-file-earmark" aria-hidden="true"></i>
                                            <a href="/" target="_blank">
                                                cert_scol_membre3.pdf
                                                <i class="bi bi-eye" aria-hidden="true"></i>
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

                        <!-- INFO PANELS -->
                        <div class="info-panel">
                            <i class="bi bi-exclamation-lg" aria-hidden="true"></i>
                            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <div class="info-panel info-panel-error">
                            <i class="bi bi-exclamation-lg" aria-hidden="true"></i>
                            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                        <div class="info-panel info-panel-warning">
                            <i class="bi bi-exclamation-lg" aria-hidden="true"></i>
                            <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>

                    </div>
                </div>

            </main>
        </QPageContainer>

        <!-- FOOTER -->
        <QFooter id="layout-footer" :class="['variant-' + variant]">
            <div id="footer-logos">
                <div class="wrapper">
                    <img src="@/assets/img/logos/uha.png" />
                    <img src="@/assets/img/logos/hear-white.png" />
                    <img src="@/assets/img/logos/insa.png" />
                    <img src="@/assets/img/logos/ensas.png" />
                    <img src="@/assets/img/logos/engees.png" />
                    <img src="@/assets/img/logos/unistra.png" />
                </div>
            </div>
            <QToolbar>
                <div class="footer-text">
                    <RouterLink class="li-footer" to="/"><i class="bi bi-card-text"></i>{{ t("footer.about") }}</RouterLink>
                    <RouterLink class="li-footer" to="/"><i class="bi bi-envelope"></i>{{ t("footer.legal-notice") }}
                    </RouterLink>
                    <RouterLink class="li-footer" to="/"><i class="bi bi-envelope"></i>{{ t("footer.contact") }}
                    </RouterLink>
                </div>
            </QToolbar>
            <p>
                La Base de Données des Associations Etudiantes d’Alsace est un annuaire regroupant les associations
                étudiantes d’Alsace.
                Ce projet est réalisé dans le cadre du Schéma Directeur de la Vie Etudiante – Alsace, qui lie les
                établissements d’enseignement supérieur
                (Unistra, UHA, INSA, ENGEES, ENSAS, HEAR) et la BNU, en partenariat avec le Crous.
            </p>
            <p>{{ t("footer.copyright") }}</p>
        </QFooter>

    </QLayout>
</template>

<style lang="sass">
@import '@/assets/styles/header.scss'
@import '@/assets/styles/breadcrumbs.scss'
@import '@/assets/styles/footer.scss'
@import '@/assets/styles/forms.scss'
@import '@/assets/styles/home.scss'
@import '@/assets/styles/dashboard.scss'
</style>

<style lang="sass" scoped>
@import '@/assets/styles/design-system.scss'
</style>