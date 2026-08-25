<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useProjectStore} from '@/stores/useProjectStore'

const {t} = useI18n()
const projectStore = useProjectStore()
</script>

<template>
    <div class="display-row">
        <h4
            :data-test="t('project.categories')"
            class="row-title"
        >
            {{ t('project.categories') }}
        </h4>
        <p>
            <QChip
                v-for="category in projectStore.project?.categories"
                :key="category.id"
                color="commission"
                outline
            >
                {{ category.name }}
            </QChip>
        </p>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
