<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, ref} from 'vue'
import useDirectory from '@/composables/useDirectory'
import type {AssociationSearch} from '#/association'

const associationStore = useAssociationStore()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {advancedSearch} = useDirectory()

onMounted(async () => {
    loading.show
    await loadAssociationsFields()
    loading.hide
})

defineEmits(['filterAssociations'])

const settings = ref<AssociationSearch>({
    search: '',
    name: '',
    acronym: '',
    institution: null,
    institutionComponent: null,
    activityField: null
})

async function loadAssociationsFields() {
    try {
        await associationStore.getAssociationsListFields()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}
</script>

<template>
    <QForm
        class="search-text-field"
        @submit.prevent="advancedSearch(settings)"
    >
        <fieldset>
            <QInput
                v-model="settings.search"
                :label="t('directory.search')"
                :placeholder="t('directory.search-placeholder')"
                filled
                lazy-rules
            >
                <template v-slot:prepend>
                    <QIcon name="mdi-magnify"/>
                </template>
            </QInput>
            <QBtn
                :label="t('directory.search')"
                color="primary"
                icon="mdi-chevron-right"
                @click="onSearch"
            />
        </fieldset>
        <QExpansionItem
            :label="t('directory.advanced-search')"
            expand-separator
            icon="mdi-menu-right"
        >
            <fieldset>
                <QInput
                    v-model="settings.name"
                    :label="t('directory.labels.association-name')"
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="settings.acronym"
                    :label="t('directory.labels.association-acronym')"
                    filled
                    lazy-rules
                />
                <QSelect
                    v-model="settings.institution"
                    :label="t('directory.labels.association-institution')"
                    :options="associationStore.institutionNames"
                    emit-value
                    filled
                    map-options
                />
                <QSelect
                    v-model="settings.institutionComponent"
                    :label="t('directory.labels.association-component')"
                    :options="associationStore.institutionComponentNames"
                    emit-value
                    filled
                    map-options
                />
                <QSelect
                    v-model="settings.activityField"
                    :label="t('directory.labels.association-field')"
                    :options="associationStore.activityFieldNames"
                    emit-value
                    filled
                    map-options
                />
            </fieldset>
            <QBtn
                :label="t('directory.advanced-search')"
                color="primary"
                icon="mdi-chevron-right"
                type="submit"
            />
        </QExpansionItem>
    </QForm>
</template>
