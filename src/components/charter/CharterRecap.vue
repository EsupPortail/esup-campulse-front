<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import CharterRecapAssociationInfos from '@/components/charter/CharterRecapAssociationInfos.vue'
import InfoVerifyDocuments from '@/components/infoPanel/InfoVerifyDocuments.vue'
import RecapDocumentList from '@/components/documents/RecapDocumentList.vue'

const {t} = useI18n()

const props = defineProps<{
    view: 'signCharter' | 'charterDetail',
    associationId: number | null
}>()

const emit = defineEmits(['changeStep'])
</script>

<template>
    <section class="recap-sections">
        <!-- Association infos -->
        <section class="recap-section">
            <div class="recap-section-title">
                <h4 class="title-3">
                    {{
                        t('charter.site.sign-form.association-infos-update')
                    }}
                </h4>
                <QBtn
                    v-if="props.view === 'signCharter'"
                    :label="t('modify')"
                    icon="bi-pencil"
                    @click="emit('changeStep', 1)"
                />
            </div>
            <CharterRecapAssociationInfos :association="props.associationId"/>
        </section>
        <!-- Documents -->
        <section class="recap-section">
            <div class="recap-section-title">
                <h4 class="title-3">
                    {{
                        t('charter.site.sign-form.documents-upload')
                    }}
                </h4>
                <QBtn
                    v-if="props.view === 'signCharter'"
                    :label="t('modify')"
                    icon="bi-pencil"
                    @click="emit('changeStep', 2)"
                />
            </div>
            <InfoVerifyDocuments/>
            <RecapDocumentList
                :association-id="props.associationId"
                process="charter"
            />
        </section>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";
</style>