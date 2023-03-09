<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import useAssociation from '@/composables/useAssociation'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, ref, watch} from 'vue'
import {useRoute} from "vue-router";
import useUserAssociations from "@/composables/useUserAssociations";

const associationStore = useAssociationStore()
const route = useRoute()
const {
    userAssociations, newAssociations, addAssociation, removeAssociation, updateRegisterRoleInAssociation
} = useUserAssociations()
const {
    checkHasPresident,
} = useAssociation()
const {t} = useI18n()
const {notify, loading} = useQuasar()

onMounted(async () => {
    loading.show
    await loadAssociations()
    initTitle()
    loading.hide
})

const title = ref<string>()

const initTitle = () => {
    if (route.name === 'Registration') title.value = t('dashboard.association-user.add-my-associations')
    else if (route.name === 'ManageAccount') title.value = t('dashboard.association-user.add-my-new-associations')
    else title.value = t('user-manager.register-in-new-associations')
}
watch(() => route.path, initTitle)

async function loadAssociations() {
    try {
        await associationStore.getAssociationNames(false)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}
</script>

<template>
    <fieldset>
        <legend class="legend-big">{{ title }}
        </legend>
        <div v-for="(association, index) in newAssociations" :key="index">
            <QSelect
                v-model="association.id"
                :label="t('forms.select-association')"
                :options="associationStore.associationLabels"
                emit-value
                filled
                map-options
                @update:model-value="checkHasPresident(association)"
            />
            <QOptionGroup
                v-model="association.role"
                :options="association.options"
                inline
                @update:model-value="updateRegisterRoleInAssociation"
            />
            <QBtn
                :label="t('forms.delete-association')"
                color="red" icon="mdi-minus-circle-outline"
                outline
                @click="removeAssociation(index)"
            />
            <QSeparator/>
        </div>
        <QBtn v-if="newAssociations.length < (5 - userAssociations.length)" :label="t('forms.add-association')"
              class="add-association"
              color="primary"
              icon="mdi-plus-circle-outline" outline @click="addAssociation"/>
    </fieldset>
</template>

<style lang="sass" scoped>
fieldset
    border: none

.legend-big
    font-size: 1.5em

.q-btn
    margin: 15px 0
    display: block

.q-input
    margin: 15px 0

.add-association
    margin: 15px 0 0 0
</style>
