<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useAssociationStore } from "@/stores/useAssociationStore";
import { onMounted, ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";

const { t } = useI18n()
const { loading, notify } = useQuasar()
const route = useRoute()

const associationStore = useAssociationStore()

const association = ref(associationStore.association)
watch(() => associationStore.association, () => {
    association.value = associationStore.association
})
watch(() => route.path, () => {
    if (route.name === 'AssociationDashboard') onGetAssociationDetail()
})

onMounted(async function () {
    loading.show
    await onGetAssociationDetail()
    loading.hide
})

async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), false)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

</script>

<template>
    <h1>{{ association?.name }}</h1>

    <QBtn :label="t('dashboard.association-user.edit-my-association')" :to="{ name: 'EditAssociation' }" color="secondary" />

    <QBtn :label="t('association.more-details')" :to="{ name: 'AssociationDetail', params: { id: association?.id } }" />
</template>

