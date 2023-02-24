<script lang="ts" setup>
import {type PropType, ref} from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import axios from "axios";
import router from "@/router";
import {useUserManagerStore} from "@/stores/useUserManagerStore";
import useUsers from "@/composables/useUsers";
import useUserGroups from "@/composables/useUserGroups";
import useAssociation from "@/composables/useAssociation";
import useSecurity from "@/composables/useSecurity";
import type {UserToUpdate} from "#/user";

const confirmation = ref<boolean>(false)
const { t } = useI18n()
const { notify } = useQuasar()
const userManagerStore = useUserManagerStore()
const {updateUserAssociations} = useUsers()
const {updateUserGroups} = useUserGroups()
const {newAssociations, updateRegisterRoleInAssociation} = useAssociation()
const {userAssociationsRegister} = useSecurity()

const props = defineProps({
    user: Object as PropType<UserToUpdate>,
})

const emit = defineEmits(['hasValidated'])

async function onValidateChanges() {
    try {
        await userManagerStore.updateUserInfos(props.user as UserToUpdate)
        updateUserAssociations()
        if (newAssociations.value.length > 0) {
            const newAssociationsRoles = updateRegisterRoleInAssociation()
            await userAssociationsRegister(false, props.user?.username as string, newAssociationsRoles)
        }
        await updateUserGroups()
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
