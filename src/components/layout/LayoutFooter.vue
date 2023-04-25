<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useColorVariants from '@/composables/useColorVariants'

const {t} = useI18n()
const {colorVariant} = useColorVariants()
</script>

<template>
    <QFooter
        id="layout-footer"
        :class="'variant-' + colorVariant"
        elevated
    >
        <div id="footer-logos">
            <div class="wrapper">
                <a href="https://www.crous-strasbourg.fr/">
                    <img
                        alt="Logo du Centre régional des œuvres universitaires et scolaires"
                        src="@/assets/img/logos/crous.png"
                    />
                </a>
                <a href="https://www.unistra.fr/">
                    <img
                        alt="Logo de l'Université de Strasbourg"
                        src="@/assets/img/logos/unistra.png"
                    />
                </a>
                <!--
                <a href="https://www.uha.fr/">
                    <img
                        src="@/assets/img/logos/uha.png"
                        alt="Logo de l'Université de Haute-Alsace"
                    />
                </a>
                <a href="https://www.insa-strasbourg.fr/">
                    <img
                        src="@/assets/img/logos/insa.png"
                        alt="Logo de l'Institut National des Sciences Appliquées Strasbourg"
                    />
                </a>
                <a href="https://www.hear.fr/">
                    <img
                        src="@/assets/img/logos/hear-white.png"
                        alt="Logo de la Haute École des Arts du Rhin"
                    />
                </a>
                <a href="https://engees.unistra.fr/">
                    <img
                        src="@/assets/img/logos/engees.png"
                        alt="Logo de l'École Nationale du Génie de l'Eau et de l'Environnement de Strasbourg"
                    />
                </a>
                <a href="https://www.strasbourg.archi.fr/">
                    <img
                        src="@/assets/img/logos/ensas.png"
                        alt="Logo de l'École Nationale Supérieure d'Architecture de Strasbourg"
                    />
                </a>
                -->
            </div>
        </div>
        <QToolbar>
            <div class="footer-text">
                <RouterLink
                    class="li-footer"
                    to="about-page"
                >
                    <i class="bi bi-card-text"></i>{{ t("footer.about") }}
                </RouterLink>
                <RouterLink
                    class="li-footer"
                    to="/"
                >
                    <i class="bi bi-envelope"></i>{{ t("footer.legal-notice") }}
                </RouterLink>
                <RouterLink
                    class="li-footer"
                    to="contact-page"
                >
                    <i class="bi bi-envelope"></i>{{ t("footer.contact") }}
                </RouterLink>
                <!-- <QToolbarTitle>{{ t("footer.copyright") }}</QToolbarTitle> -->
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
</template>

<style lang="scss">
@import '@/assets/styles/footer.scss';
</style>
