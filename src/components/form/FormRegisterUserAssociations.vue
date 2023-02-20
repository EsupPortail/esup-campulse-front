<script lang="ts" setup>
import {useAssociationStore} from '@/stores/useAssociationStore'
import useAssociation from '@/composables/useAssociation'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, ref, watch} from 'vue'
import type {AssociationUser} from "#/user"

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
        await associationStore.getAssociationNames()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

function checkHasPresident(associationId: number) {
    console.log(optionsAssociationRole)
    for (let association of associationStore.associationNames) {
        if (association.id === associationId) {
            selectedRoleOption.value = ""
            return association.hasPresident
        }
    }
}

// const selectedRoleOption = ref<string>("")

interface Association {
    id: number | null,
    role: string
}

const associations = ref<Association[]>([])

const initAssociations = () => {
    console.log('ici')
    associations.value = newAssociations.value.map(function (association) {
        return {
            id: association.id,
            role: ''
        }
    })
}
watch(() => newAssociations.value.length, initAssociations)

function updateRegisterRoleInAssociation(association: AssociationUser) {
    association.isPresident = false
    association.isSecretary = false
    association.isTreasurer = false
    switch (selectedRoleOption.value) {
        case 'isPresident':
            association.isPresident = true
            break
        case 'isSecretary':
            association.isSecretary = true
            break
        case 'isTreasurer':
            association.isTreasurer = true
            break
    }
}

const optionsAssociationRole = [
    {
        label: t('forms.im-association-president'),
        value: "isPresident",
    },
    {
        label: t('forms.im-association-secretary'),
        value: "isSecretary"
    },
    {
        label: t('forms.im-association-treasurer'),
        value: "isTreasurer"
    }
]

</script>

<template>
    <fieldset>
        <legend class="legend-big">{{ t("forms.add-my-associations") }}</legend>
        <div v-for="(association, index) in associations" :key="index">
            <QSelect v-model="association.id" :label="t('forms.select-association')"
                     :options="associationStore.associationLabels" emit-value filled map-options
                     @update:model-value="optionsAssociationRole[0].disable = checkHasPresident(association.id)"/>
            <QOptionGroup v-model="association.role" :options="optionsAssociationRole" inline
                          @update:model-value="updateRegisterRoleInAssociation(association)"/>
            <QBtn :label="t('forms.delete-association')" color="red" icon="mdi-minus-circle-outline" outline
                  @click="removeAssociation(index)"/>
            <QSeparator/>
        </div>
        <QBtn v-if="newAssociations.length < 5" :label="t('forms.add-association')" class="add-association"
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
