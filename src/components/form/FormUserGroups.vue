<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import {useI18n} from 'vue-i18n'
import {onMounted, onUnmounted, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import {useUserManagerStore} from "@/stores/useUserManagerStore";

const {t} = useI18n()
const {groupChoiceIsValid, newGroups, getGroups, groupLabels, groups, initGroupLabels, preSelectGroup} = useUserGroups()
const {notify, loading} = useQuasar()
const route = useRoute()
const userManagerStore = useUserManagerStore()

onMounted(async () => {
    loading.show
    await onGetGroups()
    onInitGroupLabels()
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

function onInitGroupLabels() {
    try {
        let privacy = false
        if (route.name === 'Registration') privacy = true
        initGroupLabels(privacy)

        if (route.name === 'Registration') preSelectGroup('STUDENT_INSTITUTION')
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

const initUserGroups = () => {
    if (route.name === 'UserManagementDetail') {
        userManagerStore.user?.groups.map((group) => {
            newGroups.value.push(group.groupId)
        })
    }
}
watch(() => userManagerStore.user, initUserGroups)
</script>

<template>
    <fieldset>
        <legend class="legend-big">{{route.name === 'Registration' ? t('forms.status') : t('user-manager.user-status')}}</legend>
        <QField
            v-if="groups"
            :error="!groupChoiceIsValid"
            :error-message="t('forms.required-status')"
            :hint="t('forms.status-hint')"
        >
            <QOptionGroup
                v-model="newGroups"
                :options="groupLabels"
                color="primary"
                type="checkbox"
            />
        </QField>
    </fieldset>
</template>

<style lang="sass" scoped>
.legend-big
    font-size: 1.5em
</style>
