<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, reactive, ref, toRefs, watch} from 'vue'
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";
import type {AssociationUserDetail} from "#/user";
import useUtility from "@/composables/useUtility";
import useUserAssociations from "@/composables/useUserAssociations";

const props = defineProps<{
    member: AssociationUserDetail
}>()

const memberRef = toRefs(props).member

const route = useRoute()
const {notify} = useQuasar()
const {t} = useI18n()
const {fromDateIsAnterior} = useUtility()
const {patchUserAssociations} = useUserAssociations()

const openDelegationPanel = ref<boolean>()

const delegation = reactive({
    canBePresident: false,
    from: '',
    to: ''
})

const initDelegationParams = () => {
    delegation.canBePresident = memberRef.value.canBePresident
    delegation.from = memberRef.value.canBePresidentFrom ?? new Date().toJSON().slice(0, 10)
    delegation.to = memberRef.value.canBePresidentTo ?? ''
}
watch(() => memberRef.value, initDelegationParams)

onMounted(initDelegationParams)

const dateIsLegal = ref<boolean>(false)

const initDateIsLegal = () => {
    dateIsLegal.value = fromDateIsAnterior(delegation.from, delegation.to)
}
watch(() => delegation.from, initDateIsLegal)
watch(() => delegation.to, initDateIsLegal)

async function onDelegatePresidency() {
    try {
        if (memberRef.value.id) {
            const dataToPatch: { canBePresident: boolean, canBePresidentFrom: string, canBePresidentTo?: string } = {
                canBePresident: !delegation.canBePresident,
                canBePresidentFrom: delegation.from
            }
            if (delegation.to !== '') dataToPatch.canBePresidentTo = delegation.to
            await patchUserAssociations(memberRef.value.user.id, parseInt(route.params.id as string), dataToPatch)
        }
    } catch {
        //
    }
}

</script>

<template>
    <QBtn
        :label="t('manage')"
        color="primary"
        icon="bi-pencil"
        @click="openDelegationPanel = true"
    />
    <QDialog v-model="openDelegationPanel" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <QForm
                    class="q-gutter-md"
                    @submit.prevent="onDelegatePresidency"
                >
                    <h3 class="section-title"><i class="bi bi-card-text"></i>Déléguer mes droits de présidence</h3>

                    <p>Je délègue mes droits de présidence à <strong>{{
                            memberRef.user.firstName + ' ' + memberRef.user.lastName
                        }}</strong></p>

                    <QInput
                        v-model="delegation.from"
                        filled
                        label="A partir du"
                        type="date"
                    />
                    <QInput
                        v-model="delegation.to"
                        filled
                        hint="Laisser le champ vide pour une date indéterminée."
                        label="Jusqu'au"
                        type="date"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                    />
                    <QBtn
                        v-close-popup
                        :disable="!dateIsLegal"
                        :label="t('validate')"
                        type="submit"
                    />
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>