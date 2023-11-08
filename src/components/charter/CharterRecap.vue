<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import CharterRecapAssociationInfos from '@/components/charter/CharterRecapAssociationInfos.vue'
import InfoVerifyDocuments from '@/components/infoPanel/InfoVerifyDocuments.vue'
import RecapDocumentList from '@/components/documents/RecapDocumentList.vue'

const {t} = useI18n()

const props = defineProps<{
    view: 'signCharter' | 'charterDetail',
    associationId: number | undefined
}>()

const emit = defineEmits(['changeStep'])
</script>

<template>
    <div class="flex-column">
        <!-- Association infos -->
        <div>
            <div class="flex-row-space-between">
                <h4>
                    {{
                        t('charter.site.sign-form.association-infos-update')
                    }}
                </h4>
                <QBtn
                    v-if="props.view === 'signCharter'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="charter"
                    icon="bi-pencil"
                    text-color="charter"
                    @click="emit('changeStep', 1)"
                />
            </div>
            <CharterRecapAssociationInfos :association="props.associationId"/>
        </div>
        <!-- Documents -->
        <div>
            <div class="flex-row-space-between">
                <h4>
                    {{
                        t('charter.site.sign-form.documents-upload')
                    }}
                </h4>
                <QBtn
                    v-if="props.view === 'signCharter'"
                    :label="t('modify')"
                    class="btn-lg"
                    color="charter"
                    icon="bi-pencil"
                    text-color="charter"
                    @click="emit('changeStep', 2)"
                />
            </div>
            <InfoVerifyDocuments/>
            <RecapDocumentList
                :association-id="props.associationId"
                process="charter"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/dashboard.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/_variables.scss";
</style>
