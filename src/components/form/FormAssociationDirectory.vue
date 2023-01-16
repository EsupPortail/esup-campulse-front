<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, ref} from 'vue'
import type {AssociationSearch} from '#/association'

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
</script>

<template>
    <QInput
        v-model="settings.name"
        :label="t('directory.labels.association-name')"
        filled
        lazy-rules
        @update:model-value="$emit('filterAssociations', 'name', settings.name)"
    />
    <QInput
        v-model="settings.acronym"
        :label="t('directory.labels.association-acronym')"
        filled
        lazy-rules
        @update:model-value="$emit('filterAssociations', 'acronym', settings.acronym)"
    />
    <QSelect
        v-model="settings.institution"
        :label="t('directory.labels.association-institution')"
        :options="associationStore.institutionNames"
        emit-value
        filled
        map-options
        @update:model-value="$emit('filterAssociations', 'institution', settings.institution)"
    />
    <QSelect
        v-model="settings.institutionComponent"
        :label="t('directory.labels.association-component')"
        :options="associationStore.institutionComponentNames"
        emit-value
        filled
        map-options
        @update:model-value="$emit('filterAssociations', 'institutionComponent', settings.institutionComponent)"
    />
    <QSelect
        v-model="settings.activityField"
        :label="t('directory.labels.association-field')"
        :options="associationStore.activityFieldNames"
        emit-value
        filled
        map-options
        @update:model-value="$emit('filterAssociations', 'activityField', settings.activityField)"
    />
</template>

<style lang="sass" scoped>
</style>
