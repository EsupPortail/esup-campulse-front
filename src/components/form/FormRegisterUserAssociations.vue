<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import useAssociation from "@/composables/useAssociation";
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";
import {onMounted} from "vue";

const associationStore = useAssociationStore()
const {newAssociations, addAssociation, removeAssociation} = useAssociation()
const {t} = useI18n()
const {notify, loading} = useQuasar()

onMounted(async () => {
    loading.show
    await loadAssociations()
    loading.hide
})

async function loadAssociations() {
    try {
        await associationStore.getAssociations()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}
</script>

<template>
    <fieldset>
      <legend>{{ t("forms.im-in-association") }}</legend>
      <div v-for="(association, index) in newAssociations" :key="index">
        <QSelect
            v-model="association.id"
            :label="t('forms.select-association')"
            :options="associationStore.associationNames"
            emit-value
            filled
            map-options
        />
        <QInput
            v-model="association.roleName"
            :label="t('forms.association-role-name')"
            filled
            lazy-rules
        />
        <QCheckbox
            v-model="association.hasOfficeStatus"
            :label="t('forms.im-in-association-office')"
        />
        <QCheckbox
            v-model="association.isPresident"
            :label="t('forms.im-association-president')"
        />
        <QBtn
            :label="t('forms.delete-association')"
            color="red"
            icon="mdi-minus-circle-outline"
            outline
            @click="removeAssociation(index)"
        />
        <QSeparator/>
      </div>
      <QBtn
          v-if="newAssociations.length < 5"
          :label="t('forms.add-association')"
          class="add-association"
          color="primary" icon="mdi-plus-circle-outline"
          outline
          @click="addAssociation"
      />
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