<script lang="ts" setup>
import {RouterLink} from 'vue-router'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <QFooter elevated>
        <QToolbar>
            <div class="footer-text">
                <QToolbarTitle>{{ t("footer.copyright") }}</QToolbarTitle>
                <RouterLink class="li-footer" to="/">{{ t("footer.about") }}</RouterLink>
                <RouterLink class="li-footer" to="/">{{ t("footer.legal-notice") }}</RouterLink>
                <RouterLink class="li-footer" to="/">{{ t("footer.contact") }}</RouterLink>
            </div>
        </QToolbar>
    </QFooter>
</template>
