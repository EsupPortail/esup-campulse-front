<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, reactive, ref, toRefs, watch} from 'vue'
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";
import type {AssociationMember} from "#/user";
import useUtility from "@/composables/useUtility";
import useUserAssociations from "@/composables/useUserAssociations";

const props = defineProps<{
    member: AssociationMember
}>()

const memberRef = toRefs(props).member

const route = useRoute()
const {notify} = useQuasar()
const {t} = useI18n()
const {fromDateIsAnterior} = useUtility()
const {patchUserAssociations, initAssociationMembers} = useUserAssociations()

const openDelegationPanel = ref<boolean>()

const delegation = reactive({
    canBePresident: false,
    from: '',
    to: ''
})

const initDelegationParams = () => {
    delegation.canBePresident = memberRef.value.canBePresident as boolean
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

async function onDelegatePresidency(activate: boolean) {
    try {
        if (memberRef.value.id) {
            const dataToPatch: { canBePresident: boolean, canBePresidentFrom: string | null, canBePresidentTo: string | null } = {
                canBePresident: activate,
                canBePresidentFrom: activate ? delegation.from : null,
                canBePresidentTo: activate && delegation.to !== '' ? delegation.to : null
            }
            const associationId = parseInt(route.params.id as string)
            await patchUserAssociations(memberRef.value.id, associationId, dataToPatch)

            await initAssociationMembers(associationId)

            notify({
                type: 'positive',
                message: t('notifications.positive.delegation-success')
            })
        }
    } catch {
        notify({
            type: 'negative',
            message: t('notifications.negative.delegation-fail')
        })
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
                    @submit.prevent="onDelegatePresidency(true)"
                >
                    <h3 class="section-title"><i class="bi bi-card-text"></i>
                        {{ t('dashboard.association-user.delegate-presidency') }}
                    </h3>

                    <p>{{ t('dashboard.association-user.i-delegate-presidency') }} <strong>{{
                            memberRef.firstName + ' ' + memberRef.lastName
                        }}</strong></p>

                    <QInput
                        v-model="delegation.from"
                        :label="t('from')"
                        filled
                        type="date"
                    />
                    <QInput
                        v-model="delegation.to"
                        :hint="t('forms.hint-delegation-to')"
                        :label="t('to')"
                        filled
                        type="date"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                    />
                    <QBtn
                        v-close-popup
                        :disable="!dateIsLegal"
                        :label="t('activate')"
                        type="submit"
                    />
                    <QBtn
                        v-if="props.member.canBePresident"
                        v-close-popup
                        :label="t('deactivate')"
                        color="red"
                        @click="onDelegatePresidency(false)"
                    />
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>