<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {onMounted, reactive, ref, toRefs, watch} from 'vue'
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import type {AssociationMember} from '#/user'
import useUtility from '@/composables/useUtility'
import useUserAssociations from '@/composables/useUserAssociations'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const props = defineProps<{
    member: AssociationMember
}>()

const memberRef = toRefs(props).member

const route = useRoute()
const {notify} = useQuasar()
const {t} = useI18n()
const {fromDateIsAnterior} = useUtility()
const {patchUserAssociations, initAssociationMembers} = useUserAssociations()
const {catchHTTPError} = useErrors()

const openDelegationPanel = ref<boolean>()

const delegation = reactive({
    from: '',
    to: ''
})

const initDelegationParams = () => {
    delegation.from = memberRef.value.canBePresidentFrom ?? new Date().toJSON().slice(0, 10)
    delegation.to = memberRef.value.canBePresidentTo ?? ''
}
watch(() => memberRef.value, initDelegationParams)

onMounted(initDelegationParams)

const dateIsLegal = ref<boolean>(false)

const initDateIsLegal = () => {
    dateIsLegal.value = fromDateIsAnterior(delegation.from, delegation.to, false)
}
watch(() => delegation.from, initDateIsLegal)
watch(() => delegation.to, initDateIsLegal)

async function onDelegatePresidency(activate: boolean) {
    try {
        if (memberRef.value.id) {
            const dataToPatch: { canBePresidentFrom: string | null, canBePresidentTo: string | null } = {
                canBePresidentFrom: activate ? delegation.from : null,
                canBePresidentTo: activate && delegation.to !== '' ? delegation.to : null
            }
            const associationId = parseInt(route.params.id as string)
            await patchUserAssociations(memberRef.value.id, associationId, dataToPatch)

            await initAssociationMembers(associationId, false)

            notify({
                type: 'positive',
                message: t('notifications.positive.delegation-success')
            })
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

</script>

<template>
    <QBtn
        :label="t('delegate')"
        color="dashboard"
        icon="bi-pencil"
        outline
        @click="openDelegationPanel = true"
    />
    <QDialog
        v-model="openDelegationPanel"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <QForm
                    class="q-gutter-md"
                    @submit.prevent="onDelegatePresidency(true)"
                >
                    <h3>
                        {{ t('dashboard.association-user.delegate-presidency') }}
                    </h3>

                    <p>
                        {{ t('dashboard.association-user.i-delegate-presidency') }} <strong>{{
                            memberRef.firstName + ' ' + memberRef.lastName
                        }}</strong>
                    </p>

                    <QInput
                        v-model="delegation.from"
                        :label="t('from')"
                        color="dashboard"
                        filled
                        type="date"
                        min="1970-01-01"
                        max="2120-01-01"
                    />
                    <QInput
                        v-model="delegation.to"
                        :label="t('to')"
                        color="dashboard"
                        filled
                        type="date"
                        min="1970-01-01"
                        max="2120-01-01"
                        bottom-slots
                        for="delegation"
                    >
                        <template v-slot:hint>
                            <p aria-describedby="delegation">{{ t('forms.hint-delegation-to') }}</p>
                        </template>
                    </QInput>
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-chevron-left"
                    />
                    <QBtn
                        v-close-popup
                        :disable="!dateIsLegal"
                        :label="t('activate')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-check-lg"
                        type="submit"
                    />
                    <QBtn
                        v-if="props.member.canBePresidentFrom || props.member.canBePresidentTo"
                        v-close-popup
                        :label="t('deactivate')"
                        color="custom-red"
                        @click="onDelegatePresidency(false)"
                    />
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
</style>
