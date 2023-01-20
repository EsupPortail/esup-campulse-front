<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import useDirectory from '@/composables/useDirectory'
import type {AssociationList, AssociationSearch} from '#/association'
import {useQuasar} from 'quasar'


const {advancedSearch} = useDirectory()
const associationStore = useAssociationStore()
const {loading, notify} = useQuasar()
const {t} = useI18n()

onMounted(async function () {
    loading.show
    await associationStore.getAssociations()
    await loadAssociationsFields()
    loading.hide
})

const associations = ref<AssociationList[]>([...associationStore.associations])
watch(() => associationStore.associations, () => {
    associations.value = associationStore.associations
})

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

function onAdvancedSearch() {
    associations.value = advancedSearch(settings.value) as AssociationList[]
}
</script>

<template>
    <h1>{{ t("home.directory") }}</h1>

    <section class="introduction">
        <img :alt="t('directory.image-alt')" src="/images/unistra.jpg">
        <div>
            <h2>{{ t('directory.subtitle') }}</h2>
            <p>{{ t('directory.introduction') }}</p>
        </div>
        <QForm
            class="search-text-field"
            @submit.prevent="onAdvancedSearch"
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
    </section>

    <QCard v-for="association in associations" :key="association.id" class="my-card">
        <RouterLink :to="{name: 'AssociationDetail', params: {id: association.id}}">
            <QCardSection>
                <!-- Placeholder for logo -->
                <div></div>
                <div>
                    <h3>{{ association.name }}</h3>
                    <ul>
                        <li v-if="association.acronym">
                            {{ t('directory.labels.association-acronym') + ' : ' }}
                            <span>{{ association.acronym }}</span>
                        </li>
                        <li v-if="association.activityField">
                            {{ t('directory.labels.association-field') + ' : ' }}
                            <span>{{ association.activityField.name }}</span>
                        </li>
                        <li v-if="association.institution">
                            {{ t('directory.labels.association-institution') + ' : ' }}
                            <span>{{ association.institution.name }}</span>
                        </li>
                        <li v-if="association.institutionComponent">
                            {{ t('directory.labels.association-component') + ' : ' }}
                            <span>{{ association.institutionComponent.name }}</span>
                        </li>
                    </ul>
                </div>
            </QCardSection>
        </RouterLink>
    </QCard>
</template>
