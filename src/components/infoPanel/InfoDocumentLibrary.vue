<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
</script>

<template>
    <div class="info-panel info-panel-dashboard">
        <i
            aria-hidden="true"
            class="bi bi-info"
        ></i>
        <p>
            {{ t('dashboard.template-document-library-info-message') }}
        </p>
        <div class="btn-group">
            <QBtn
                :label="t('dashboard.template-document-library')"
                :to="{name: 'DocumentsLibrary'}"
            />
        </div>
    </div>
</template>