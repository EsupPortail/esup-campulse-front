<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, ref} from 'vue'
import router from '@/router'
import type {ManageCharter} from '#/charters'
import FormChartersValidation from '@/components/charter/FormChartersValidation.vue'
import useCharters from '@/composables/useCharters'

const {t} = useI18n()
const {downloadCharter} = useCharters()

const props = defineProps<{
    charter: ManageCharter,
    associationId: number
}>()

interface Option {
    icon: 'bi-check-lg' | 'bi-eye',
    label: string,
    to?: {
        name: string,
        params?: { associationId: number }
    },
    action?: 'view' | 'validate'
}

const options = ref<Option[]>([])

const initOptions = () => {
    options.value = []
    if (props.charter.charterStatus === 'PROCESSING') {
        if (props.charter.documentProcessType === 'CHARTER_ASSOCIATION') {
            options.value.push({
                icon: 'bi-check-lg',
                label: t('charter.options.validate'),
                to: {name: 'AssociationCharterValidation', params: {associationId: props.associationId}}
            })
        } else {
            options.value.push({
                icon: 'bi-check-lg',
                label: t('charter.options.validate'),
                action: 'validate'
            })
        }
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

const openValidate = ref<boolean>(false)

async function onOptionClick(option: Option) {
    if (option.to) await router.push(option.to)
    else if (option.action) {
        if (option.action === 'validate') {
            openValidate.value = true
        } else if (option.action === 'view') {
            if (props.charter.pathFile) {
                await downloadCharter(props.charter.pathFile, props.charter.documentName)
            }
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
    <FormChartersValidation
        :association-id="props?.associationId"
        :charter="props.charter"
        :open-validate="openValidate"
        @close-dialog="openValidate = false"
    />
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import '@/assets/styles/documents.scss';
</style>
