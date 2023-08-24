<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useColorVariants from '@/composables/useColorVariants'
import router from '@/router'
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref} from 'vue'
import type {Content, ContentCode} from '#/index'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {colorVariant} = useColorVariants()
const contentStore = useContentStore()

const footerContent = ref<Content>()

function findContentObject(code: ContentCode) {
    return contentStore.contents.find(obj => obj.code === code)
}

const initContent = () => {
    footerContent.value = findContentObject('SITE_FOOTER')
}

async function onGetContent() {
    try {
        await contentStore.getContentsByCode(['SITE_FOOTER'])
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetContent()
    initContent()
    loading.hide()
})
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
                        :to="route.path"
                        class="li-footer"
                    >
                        {{
                            route?.meta?.title ? route?.meta?.title : (route?.children ? route?.children[0].meta?.title : '')
                        }}
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
        <p v-html="footerContent?.body"></p>
        <p v-html="footerContent?.footer"></p>
    </QFooter>
</template>

<style lang="scss">
@import '@/assets/styles/footer.scss';
</style>
