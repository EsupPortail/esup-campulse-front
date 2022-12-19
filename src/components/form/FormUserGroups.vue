<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import {useI18n} from 'vue-i18n'
import {UserGroup} from "#/user";
import {onMounted} from "vue";
import {useQuasar} from "quasar";

const {t} = useI18n()
const {groupChoiceIsValid, groupList, newGroups, getGroups, studentGroup} = useUserGroups()
const {notify, loading} = useQuasar()

onMounted(async () => {
    loading.show
    await loadGroups()
    loading.hide
})

async function loadGroups() {
    try {
        await getGroups()
        if (studentGroup) {
            newGroups.value.push((studentGroup.value as UserGroup).id)
        }
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
        <legend class="legend-big">{{ t('forms.status') }}</legend>
        <QField
            v-if="groupList"
            :error="!groupChoiceIsValid"
            :error-message="t('forms.required-status')"
            :hint="t('forms.status-hint')"
        >
            <QOptionGroup
                v-model="newGroups"
                :options="groupList"
                color="primary"
                type="checkbox"
            />
        </QField>
    </fieldset>
</template>

<style lang="sass" scoped>

</style>