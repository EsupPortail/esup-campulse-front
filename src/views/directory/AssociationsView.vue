<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useDirectory from '@/composables/useDirectory'
import FormAssociationDirectory from '@/components/form/FormAssociationDirectory.vue'

const associationStore = useAssociationStore()
const {loading} = useQuasar()
const {t} = useI18n()
const {shownAssociations} = useDirectory()

onMounted(async function () {
    loading.show
    await associationStore.getAssociations()
    loading.hide
})

const associations = ref(shownAssociations.value)
watch(() => shownAssociations.value, () => {
    associations.value = shownAssociations.value
})

</script>

<template>
    <h1>{{ t("home.directory") }}</h1>

    <section class="introduction">
        <img :alt="t('directory.image-alt')" src="/images/unistra.jpg">
        <div>
            <h2>{{ t('directory.subtitle') }}</h2>
            <p>{{ t('directory.introduction') }}</p>
        </div>
        <FormAssociationDirectory/>
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
