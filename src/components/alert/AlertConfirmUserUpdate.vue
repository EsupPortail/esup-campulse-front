<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import axios from 'axios'
import router from '@/router'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import useUsers from '@/composables/useUsers'
import useUserGroups from '@/composables/useUserGroups'
import useUserAssociations from '@/composables/useUserAssociations'
import useSecurity from '@/composables/useSecurity'


const {t} = useI18n()
const {notify} = useQuasar()
const userManagerStore = useUserManagerStore()
const {updateUserInfos} = useUsers()
const {updateUserGroups} = useUserGroups()
const {updateUserAssociations, userAssociations} = useUserAssociations()
const {userAssociationsRegister} = useSecurity()


const emit = defineEmits(['hasValidated'])

const confirmation = ref<boolean>(false)


async function onValidateChanges() {
    try {
        await updateUserInfos(userManagerStore.user, true)
        await updateUserAssociations(true)
        if (userAssociations.value.length > 0) {
            await userAssociationsRegister(false, userManagerStore.user?.username)
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
            if (error.response?.data.error === 'Cannot register in a public and a private group at the same time.') {
                notify({
                    type: 'negative',
                    message: t('notifications.negative.cannot-attribute-public-and-private-roles')
                })
            } else if (error.response?.data.error === 'Adding commission in this group is not possible.' ||
                error.response?.data.error === 'Not allowed to delete this link between user and group.') {
                notify({
                    type: 'negative',
                    message: t('notifications.negative.not-allowed-to-manage-this-commission')
                })
            }
        } else {
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

    <QDialog
        v-model="confirmation"
        persistent
    >
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
