<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from "@/stores/useAssociationStore";
import {onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useRoute} from "vue-router";
import useDirectory from "@/composables/useDirectory";

const {t} = useI18n()
const {loading, notify} = useQuasar()
const route = useRoute()
const {getAssociationDetail} = useDirectory()

const associationStore = useAssociationStore()

const association = ref(associationStore.association)
watch(() => associationStore.association, () => {
    association.value = associationStore.association
})
watch(() => route.path, () => {
    onGetAssociationDetail()
})

onMounted(async function () {
    loading.show
    await onGetAssociationDetail()
    loading.hide
})

async function onGetAssociationDetail() {
    try {
        await getAssociationDetail(route.params.id as string)
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

    <section>
        <h2>
            <QIcon name="mdi-pencil-box-outline"/>
            {{ t('dashboard.association-user.manage-my-associations') }}
        </h2>
        <QBtn
            :label="t('dashboard.association-user.edit-my-associations')"
            :to="{name: 'ManageAssociations'}"
            color="secondary"
        />
    </section>

    <QBtn :label="t('association.more-details')" :to="{name: 'AssociationDetail', params: {id: association?.id}}"/>

</template>

<style lang="sass" scoped>
</style>
