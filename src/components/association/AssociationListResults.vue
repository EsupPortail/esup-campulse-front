<script lang="ts" setup>
import {useI18n} from 'vue-i18n'

const {t} = useI18n()

defineProps<{
    associations: number,
    associationsOnPage: number
}>()
</script>

<template>
    <div class="directory-sorting">
        <h2>{{ t('directory.list') }}</h2>
        <div>
            <p v-if="associations > 0">
                <span>{{ associations }}</span>
                {{
                    associations > 1 ? t('directory.found-associations-plural') :
                    t('directory.found-associations-singular')
                }}{{ t('colon') }}
            </p>
            <p v-else>{{ t('directory.no-match') }}</p>
            <p>
                <span>{{ associationsOnPage }}</span>
                {{
                    associationsOnPage > 1 ? t('directory.associations-on-page-plural') :
                    t('directory.associations-on-page-singular')
                }}{{ t('colon') }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.directory-sorting {
    margin-bottom: 0.625rem;

    h2 {
        font-size: $titleSize;
        font-weight: $normal-weight;
    }

    div {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;

        p {
            font-weight: $normal-weight;
            color: $textColor2;
            line-height: 1.2rem;

            & > span {
                color: $associationColor;
                font-weight: $xbold-weight;
            }
        }
    }
}
</style>