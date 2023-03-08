<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from "axios";
import router from "@/router";
import {useUserManagerStore} from "@/stores/useUserManagerStore";
import useUsers from "@/composables/useUsers";
import useUserGroups from "@/composables/useUserGroups";
import useAssociation from "@/composables/useAssociation";
import useUserAssociations from "@/composables/useUserAssociations";


const {t} = useI18n()
const {notify} = useQuasar()
const userManagerStore = useUserManagerStore()
const {updateUserInfos} = useUsers()
const {updateUserGroups} = useUserGroups()
const {newAssociations} = useAssociation()
const {updateUserAssociations, postUserAssociations} = useUserAssociations()


const emit = defineEmits(['hasValidated'])

const confirmation = ref<boolean>(false)


async function onValidateChanges() {
    try {
        await updateUserInfos(userManagerStore.user, true) // OK
        await updateUserAssociations(true)
        if (newAssociations.value.length > 0) {
            await postUserAssociations(userManagerStore.user?.username)
        }
        await updateUserGroups() // OK
        emit('hasValidated')
        await router.push({name: 'ManageUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-success')
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            notify({
                message: t('notifications.negative.edit-user-error'),
                type: 'negative'
            })
        }
    }
}
</script>

<template>
    <QBtn
        :label="t('dashboard.validate-changes')"
        color="primary"
        icon="mdi-check-circle"
        @click="confirmation = true"
    />

    <QDialog v-model="confirmation" persistent>
        <QCard>
            <QCardSection class="row items-center">
                <span class="q-ml-sm">{{ t('user-manager.alert-confirm-update') }}</span>
            </QCardSection>

            <QCardActions align="right">
                <QBtn
                    v-close-popup
                    :label="t('cancel')"
                    color="secondary"
                    icon="mdi-arrow-left-circle"
                />
                <QBtn
                    v-close-popup
                    :label="t('dashboard.validate-changes')"
                    color="primary"
                    icon="mdi-check-circle"
                    @click="onValidateChanges"
                />
            </QCardActions>
        </QCard>
    </QDialog>
</template>
