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
                <!--<RouterLink to="/">
                    <img src="@/assets/img/logos/uha.png"/>
                </RouterLink>
                <RouterLink to="/">
                    <img src="@/assets/img/logos/hear-white.png"/>
                </RouterLink>
                <RouterLink to="/">
                    <img src="@/assets/img/logos/insa.png"/>
                </RouterLink>
                <RouterLink to="/">
                    <img src="@/assets/img/logos/ensas.png"/>
                </RouterLink>
                <RouterLink to="/">
                    <img src="@/assets/img/logos/engees.png"/>
                </RouterLink>-->
                <RouterLink to="/">
                    <img src="@/assets/img/logos/unistra.png"/>
                </RouterLink>
                <RouterLink to="/">
                    <img src="@/assets/img/logos/crous.png"/>
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
                    <i class="bi bi-envelope"></i>{{ t("footer.legal-notice") }}
                </RouterLink>
                <RouterLink
                    class="li-footer"
                    to="/"
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

<style lang="sass">
@import '@/assets/styles/footer.scss'
</style>
