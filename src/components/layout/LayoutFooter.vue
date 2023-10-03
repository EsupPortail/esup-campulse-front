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
        await contentStore.getLogos()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
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
                <li
                    v-for="logo in contentStore.logos.filter((l) => l.visible === true)"
                    :key="logo.acronym"
                >
                    <a :href="logo.url">
                        <img
                            :alt="logo.title"
                            :src="logo.pathLogo"
                        />
                    </a>
                </li>
            </ul>
        </div>
        <QToolbar>
            <ul class="footer-text">
                <li
                    v-for="route in router.options.routes[0].children?.filter((r) => r?.meta?.siteMap === true)"
                    :key="route.name"
                >
                    <RouterLink
                        :to="{name: route?.name ?? route?.children[0].name}"
                        class="li-footer"
                    >
                        {{
                            route?.meta?.title ?? route?.children[0].meta?.title ?? ''
                        }}
                    </RouterLink>
                </li>
                <li>
                    <RouterLink
                        :to="{name: 'Login'}"
                        class="li-footer"
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
