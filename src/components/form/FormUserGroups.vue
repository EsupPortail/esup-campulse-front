<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import {useI18n} from 'vue-i18n'
import {onMounted, onUnmounted} from 'vue'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import useCommissions from '@/composables/useCommissions'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

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
} = useUserGroups()
const {notify, loading} = useQuasar()
const route = useRoute()
const {
    getFunds,
    fundsLabels,
    initFundsLabels,
    userFunds,
    initUserFunds
} = useCommissions()
const {catchHTTPError} = useErrors()

onMounted(async () => {
    loading.show()
    await onGetGroups()
    onInitGroupLabels()
    await onGetCommissions()
    loading.hide()
})

// Used to clean newGroups value
onUnmounted(() => {
    newGroups.value = []
})

async function onGetGroups() {
    try {
        await getGroups()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
}

async function onGetCommissions() {
    try {
        await getFunds()
        initFundsLabels()
        initUserFunds()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
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
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response.status)
            })
        }
    }
}

</script>

<template>
    <QField
        v-if="groups"
        :error="!groupChoiceIsValid"
        :error-message="t('forms.required-status')"
        borderless
        color="base"
    >
        <QOptionGroup
            v-model="newGroups"
            :aria-label="t('forms.group-role')"
            :options="groupLabels"
            color="dashboard"
            type="checkbox"
            @update:model-value="initGroupPermToJoinAssociation(newGroups)"
        />
    </QField>
    <QSelect
        v-if="commissionMemberIsSelected"
        v-model="userFunds"
        :label="t('commission.commission', 2)"
        :options="fundsLabels"
        :rules="[ val => val.length >= 1 || t('forms.required-commission')]"
        color="dashboard"
        emit-value
        filled
        map-options
        multiple
        style="width: 250px"
        use-chips
    />
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
</style>
