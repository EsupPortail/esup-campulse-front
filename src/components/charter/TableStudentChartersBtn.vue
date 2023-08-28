<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref, watch} from 'vue'
import router from '@/router'
import type {ManageCharter} from '#/charters'
import useDocumentUploads from '@/composables/useDocumentUploads'
import FormSignCharters from '@/components/charter/FormSignCharters.vue'
import useCharters from '@/composables/useCharters'

const {t} = useI18n()
const {documents} = useDocumentUploads()
const {downloadCharter, manageCharters} = useCharters()

const props = defineProps<{
    charter: ManageCharter,
    associationId: number,
    isSite: boolean
}>()

interface Option {
    icon: 'bi-download' | 'bi-pen' | 'bi-eye',
    label: string,
    to?: {
        name: string,
        params: { associationId: number }
    },
    action?: 'download' | 'view' | 'sign'
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []
    options.value.push({
        icon: 'bi-download',
        label: t('charter.options.download'),
        action: 'download'
    })
    if (props.charter.charterStatus === 'NO_CHARTER' || props.charter.charterStatus === 'EXPIRED'
        || props.charter.charterStatus === 'VALIDATED' || props.charter.charterStatus === 'REJECTED') {
        const option: Option = {
            icon: 'bi-pen',
            label: t(`charter.options.${props.charter.charterStatus === 'EXPIRED'
            || props.charter.charterStatus === 'VALIDATED' || props.charter.charterStatus === 'REJECTED' ? 're-' : ''}sign`)
        }
        if (props.charter.documentProcessType === 'CHARTER_ASSOCIATION') {
            option.to = {
                name: 'SignCharter',
                params: {associationId: props.associationId}
            }
        } else {
            option.action = 'sign'
        }
        options.value.push(option)
    }
    if (props.charter.charterStatus === 'VALIDATED' || props.charter.charterStatus === 'PROCESSING' || props.charter.charterStatus === 'REJECTED') {
        if (props.charter.documentProcessType === 'CHARTER_ASSOCIATION') {
            options.value.push({
                icon: 'bi-eye',
                label: t('charter.options.view'),
                to: {name: 'AssociationCharterDetail', params: {associationId: props.associationId}}
            })
        } else {
            options.value.push({
                icon: 'bi-eye',
                label: t('charter.options.view'),
                action: 'view'
            })
        }
    }
}

onMounted(initOptions)
watch(() => manageCharters.value.length, initOptions)

const openSign = ref<boolean>(false)

async function onOptionClick(option: Option) {
    if (option.to) await router.push(option.to)
    else if (option.action) {
        if (option.action === 'download') {
            if (props.charter.pathTemplate) {
                await downloadCharter(props.charter.pathTemplate, props.charter.documentName)
            }
        } else if (option.action === 'view') {
            if (props.charter.pathFile) {
                await downloadCharter(props.charter.pathFile, props.charter.documentName)
            }
        } else if (option.action === 'sign') {
            openSign.value = true
        }
    }
}

</script>

<template>
    <div class="q-pa-md">
        <QBtnDropdown
            v-if="options.length"
            :label="t('manage')"
            class="text-charter"
            outline
        >
            <QList>
                <QItem
                    v-for="(option, index) in options"
                    :key="index"
                    v-close-popup
                    clickable
                    @click="onOptionClick(option)"
                >
                    <QItemSection avatar>
                        <QAvatar
                            :icon="option.icon"
                        />
                    </QItemSection>
                    <QItemSection>
                        <QItemLabel>{{ option.label }}</QItemLabel>
                    </QItemSection>
                </QItem>
            </QList>
        </QBtnDropdown>
    </div>
    <FormSignCharters
        :association-id="props.associationId"
        :charter="props.charter"
        :is-site="props.isSite"
        :open-sign="openSign"
        @close-dialog="openSign = false"
    />
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import '@/assets/styles/documents.scss';
</style>
