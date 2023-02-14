<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import {useI18n} from 'vue-i18n'
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'

const {t} = useI18n()
const {groupChoiceIsValid, newGroups, getGroups, groupLabels, groups, initGroupLabels} = useUserGroups()
const {notify, loading} = useQuasar()
const route = useRoute()

onMounted(async () => {
    loading.show
    await onGetGroups()
    onInitGroupLabels()
    loading.hide
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
        <legend class="legend-big">{{
                route.name === 'Registration' ? t('forms.status') : t('user-manager.user-status')
            }}
        </legend>
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
