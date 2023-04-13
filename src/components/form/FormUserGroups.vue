<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import {useI18n} from 'vue-i18n'
import {onMounted, onUnmounted} from 'vue'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import useCommissions from '@/composables/useCommissions'

const {t} = useI18n()
const {
    groupChoiceIsValid,
    newGroups,
    getGroups,
    groupLabels,
    groups,
    initGroupLabels,
    preSelectGroup,
    initGroupPermToJoinAssociation,
    commissionMemberIsSelected,
    initCommissionMemberSelection
} = useUserGroups()
const {notify, loading} = useQuasar()
const route = useRoute()
const {getCommissions, commissionOptions, userCommissions} = useCommissions()
const {initUserCommissions} = useCommissions()

onMounted(async () => {
    loading.show
    await onGetGroups()
    onInitGroupLabels()
    await onGetCommissions()
    initCommissionMemberSelection()
    initUserCommissions()
    loading.hide
})

// Used to clean newGroups value
onUnmounted(() => {
    newGroups.value = []
})

async function onGetGroups() {
    try {
        await getGroups()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

async function onGetCommissions() {
    try {
        await getCommissions()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

function onInitGroupLabels() {
    try {
        // Init group labels
        let privacy = false
        if ((route.name === 'Registration') || (route.name === 'AddUser') || (route.name === 'CASRegistration')) privacy = true
        initGroupLabels(privacy)

        // Preselect group
        if ((route.name === 'Registration') || (route.name === 'AddUser') || (route.name === 'CASRegistration')) preSelectGroup('STUDENT_INSTITUTION')
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
        <QField
            v-if="groups"
            :error="!groupChoiceIsValid"
            :error-message="t('forms.required-status')"
            borderless
        >
            <QOptionGroup
                v-model="newGroups"
                :options="groupLabels"
                color="teal"
                type="checkbox"
                @update:model-value="initGroupPermToJoinAssociation"
            />
        </QField>
        <QSelect
            v-if="commissionMemberIsSelected"
            v-model="userCommissions"
            :label="t('commissions')"
            :options="commissionOptions"
            :rules="[ val => val.length >= 1 || t('forms.required-commission')]"
            emit-value
            filled
            map-options
            multiple
            style="width: 250px"
            use-chips
        />
    </fieldset>
</template>

<style lang="scss">
@import "@/assets/_variables.scss";

fieldset {
    border: none;
    margin: 0 0 0 .4rem;
}

.q-option-group {
    color: $dashboardColor;
}
</style>
