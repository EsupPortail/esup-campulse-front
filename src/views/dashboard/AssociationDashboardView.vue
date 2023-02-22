<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from "@/stores/useAssociationStore";
import {onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useRoute} from "vue-router";
import {useUserStore} from "@/stores/useUserStore";
import type {Association} from "#/association";

const {t} = useI18n()
const {loading, notify} = useQuasar()
const route = useRoute()

const associationStore = useAssociationStore()
const userStore = useUserStore()

onMounted(async function () {
    loading.show
    await onGetAssociationDetail()
    await onGetUserAssociations()
    loading.hide
})

watch(() => route.path, async () => {
    if (route.name === 'AssociationDashboard') await onGetAssociationDetail()
})

const association = ref<Association>()

const hasPresidentStatus = ref<boolean>(false)

const initValues = () => {
    association.value = associationStore.association
    hasPresidentStatus.value = userStore.hasPresidentStatus(association?.value?.id as number)
}

watch(() => associationStore.association, initValues)
watch(() => userStore.userAssociations, initValues)


async function onGetAssociationDetail() {
    try {
        await associationStore.getAssociationDetail(parseInt(route.params.id as string), false)
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

async function onGetUserAssociations() {
    try {
        await userStore.getUserAssociations()
    } catch (error) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

</script>

<template>
    <h1>{{ association?.name }}</h1>

    <QBtn
        v-if="hasPresidentStatus"
        :label="t('dashboard.association-user.edit-my-association')"
        :to="{ name: 'EditMyAssociation', params: {id: association?.id} }"
        color="secondary"
    />

    <QBtn
        v-if="association?.isPublic"
        :label="t('association.more-details')"
        :to="{ name: 'AssociationDetail', params: { id: association?.id } }"
    />
</template>

