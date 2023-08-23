<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useColorVariants from '@/composables/useColorVariants'
import router from '@/router'

const {t} = useI18n()
const {colorVariant} = useColorVariants()
</script>

<template>
    <QFooter
        id="layout-footer"
        :class="'variant-' + colorVariant"
        role="contentinfo"
    >
        <div id="footer-logos">
            <ul class="wrapper">
                <li>
                    <a href="https://www.crous-strasbourg.fr/">
                        <img
                            alt="Le Centre régional des œuvres universitaires et scolaires"
                            src="@/assets/img/logos/crous.png"
                        />
                    </a>
                </li>
                <li>
                    <a href="https://www.unistra.fr/">
                        <img
                            alt="L'Université de Strasbourg"
                            src="@/assets/img/logos/unistra.png"
                        />
                    </a>
                </li>
                <!--
                <li>
                    <a href="https://www.uha.fr/">
                        <img
                            alt="L'Université de Haute-Alsace"
                            src="@/assets/img/logos/uha.png"
                        />
                    </a>
                </li>
                <li>
                    <a href="https://www.insa-strasbourg.fr/">
                        <img
                            alt="L'Institut National des Sciences Appliquées Strasbourg"
                            src="@/assets/img/logos/insa.png"
                        />
                    </a>
                </li>
                <li>
                    <a href="https://www.hear.fr/">
                        <img
                            alt="La Haute École des Arts du Rhin"
                            src="@/assets/img/logos/hear-white.png"
                        />
                    </a>
                </li>
                <li>
                    <a href="https://engees.unistra.fr/">
                        <img
                            alt="L'École Nationale du Génie de l'Eau et de l'Environnement de Strasbourg"
                            src="@/assets/img/logos/engees.png"
                        />
                    </a>
                </li>
                <li>
                    <a href="https://www.strasbourg.archi.fr/">
                        <img
                            alt="L'École Nationale Supérieure d'Architecture de Strasbourg"
                            src="@/assets/img/logos/ensas.png"
                        />
                    </a>
                </li>
                -->
                <li>
                    <a href="https://cvec.etudiant.gouv.fr/">
                        <img
                            alt="La Contribution Vie Étudiante et de Campus"
                            src="@/assets/img/logos/cvec.png"
                        />
                    </a>
                </li>
                <li>
                    <a href="https://www.economie.gouv.fr/plan-de-relance">
                        <img
                            alt="France Relance"
                            src="@/assets/img/logos/france-relance.png"
                        />
                    </a>
                </li>
                <li>
                    <a href="https://www.enseignementsup-recherche.gouv.fr/">
                        <img
                            alt="Le Ministère de l'Enseignement Supérieur et de la Recherche"
                            src="@/assets/img/logos/esr.png"
                        />
                    </a>
                </li>
            </ul>
        </div>
        <QToolbar>
            <ul class="footer-text">
                <li
                    v-for="route in router.options.routes[0].children?.filter((r) => r.meta?.siteMap === true)"
                    :key="route.name"
                >
                    <RouterLink
                        class="li-footer"
                        :to="route.path"
                    >
                        {{ route?.meta?.title ? route?.meta?.title : (route?.children ? route?.children[0].meta?.title : '') }}
                    </RouterLink>
                </li>
                <li>
                    <RouterLink
                        class="li-footer"
                        to="/login"
                    >
                        {{ t('login.login') }}
                    </RouterLink>
                </li>
            </ul>
        </QToolbar>
        <p>{{ t('footer.database') }}</p>
        <p>{{ t('footer.copyright') }}</p>
    </QFooter>
</template>

<style lang="scss">
@import '@/assets/styles/footer.scss';
</style>
