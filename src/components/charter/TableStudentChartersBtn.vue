<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref, toRefs, watch} from 'vue'
import router from '@/router'
import type {AssociationCharterStatus, ManageCharter} from '#/charters'
import FormSignCharters from '@/components/charter/FormSignCharters.vue'
import useDocumentUploads from '@/composables/useDocumentUploads'
import useDocuments from '@/composables/useDocuments'

const {t} = useI18n()
const {createUploadedFileLink} = useDocumentUploads()
const {createFileLink} = useDocuments()

const props = defineProps<{
    charter: ManageCharter,
    associationId: number,
    associationCharterStatus?: AssociationCharterStatus,
    isSite?: boolean
}>()

const charterRef = toRefs(props).charter
watch(() => charterRef.value, () => {
    initOptions()
})

interface Option {
    icon: 'bi-download' | 'bi-pen' | 'bi-eye',
    label?: string,
    to?: {
        name: string,
        params: { associationId: number }
    },
    action?: 'download' | 'view' | 'sign',
    id?: number
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []
    // Download docs
    props.charter.pathTemplate.forEach(template => {
        options.value.push({
            icon: 'bi-download',
            label: t('charter.options.download', {documentName: template.name}),
            action: 'download',
            id: template.documentId
        })
    })
    // Sign or resign charter
    if (props.charter.charterStatus !== 'PROCESSING') {
        const option: Option = {
            icon: 'bi-pen',
            label: props.charter.charterStatus === 'NOT_SITE' || props.charter.charterStatus === 'NO_CHARTER' || props.charter.charterStatus === 'EXPIRED' ?
                t('charter.options.sign') : t('charter.options.re-sign')

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
    // View charter
    if (props.charter.charterStatus === 'PROCESSING' || props.charter.charterStatus === 'VALIDATED' || props.charter.charterStatus === 'RETURNED' ||
        props.charter.charterStatus === 'REJECTED') {
        const option: Option = {
            icon: 'bi-eye',
            label: t('charter.options.view')
        }
        if (props.charter.documentProcessType === 'CHARTER_ASSOCIATION') {
            option.to = {name: 'AssociationCharterDetail', params: {associationId: props.associationId}}
        } else {
            option.action = 'view'
        }
        options.value.push(option)
    }
}

onMounted(initOptions)

const openSign = ref<boolean>(false)

async function onOptionClick(option: Option) {
    if (option.to) await router.push(option.to)
    else if (option.action) {
        if (option.action === 'download') {
            if (props.charter.pathTemplate.length) {
                const pathTemplate = props.charter.pathTemplate.find(pathTemplate => pathTemplate.documentId === option.id)
                if (pathTemplate) await createFileLink(pathTemplate.path, props.charter.documentName)
            }
        } else if (option.action === 'view') {
            if (props.charter.pathFile) {
                await createUploadedFileLink(props.charter.pathFile, props.charter.documentName)
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
        :association-charter-status="props.associationCharterStatus"
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
