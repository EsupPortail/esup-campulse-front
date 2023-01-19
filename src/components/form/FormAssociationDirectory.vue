<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, ref} from 'vue'
import type {AssociationDirectory, AssociationSearch} from '#/association'

const associationStore = useAssociationStore()
const {t} = useI18n()
const {notify, loading} = useQuasar()

onMounted(async () => {
    loading.show
    await loadAssociationsFields()
    loading.hide
})

defineEmits(['filterAssociations'])

const settings = ref<AssociationSearch>({
    name: "",
    acronym: "",
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

function onNameSearch() {
    if (settings.value.name) {
        const matches: AssociationDirectory[] = associationStore.associationDirectory.find(({name}) => name.toLowerCase() === settings.value.name.toLowerCase())
    }
}
</script>

<template>
    <QForm
        class="search-text-field"
        @submit.prevent="onAdvancedSearch"
    >
        <fieldset>
            <QInput
                v-model="settings.name"
                :label="t('directory.labels.association-name')"
                filled
                lazy-rules
            />
            <QBtn
                :label="t('directory.search')"
                color="primary"
                icon="mdi-magnify"
                @click="onNameSearch"
            />
        </fieldset>
        <QExpansionItem
            :label="t('directory.advanced-search')"
            expand-separator
            icon="mdi-menu-right"
        >
            <fieldset>
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
                :label="t('directory.search')"
                color="primary"
                icon="mdi-magnify"
                type="submit"
            />
        </QExpansionItem>
    </QForm>
</template>
