<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <QFooter id="layout-footer" class="variant-space-1" elevated>
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
                <RouterLink class="li-footer" to="/"><span class="icon icon-mentions"></span>{{ t("footer.about") }}</RouterLink>
                <RouterLink class="li-footer" to="/"><span class="icon icon-contact-crous"></span>{{ t("footer.legal-notice") }}</RouterLink>
                <RouterLink class="li-footer" to="/"><span class="icon icon-contact-admin"></span>{{ t("footer.contact") }}</RouterLink>
                <!-- <QToolbarTitle>{{ t("footer.copyright") }}</QToolbarTitle> -->
            </div>
        </QToolbar>
        <p>
            La Base de Données des Associations Etudiantes d’Alsace est un annuaire regroupant les associations étudiantes d’Alsace. 
            Ce projet est réalisé dans le cadre du Schéma Directeur de la Vie Etudiante – Alsace, qui lie les établissements d’enseignement supérieur 
            (Unistra, UHA, INSA, ENGEES, ENSAS, HEAR) et la BNU, en partenariat avec le Crous.
        </p>
        <p>{{ t("footer.copyright") }}</p>
    </QFooter>
</template>
