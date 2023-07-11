<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import router from '@/router'
import useUserAssociations from '@/composables/useUserAssociations'
import type {AssociationUserDetail} from '#/user'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {
    getUserAssociations,
    associationRoleOptions,
    getAssociationUserRole,
    patchUserAssociations,
    deleteUserAssociation
} = useUserAssociations()
const {catchHTTPError} = useErrors()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()
const route = useRoute()

onMounted(async () => {
    loading.show()
    await userManagerStore.getUserDetail(parseInt(route.params.userId as string))
    await onGetUserAssociations()
    await associationStore.getInstitutions()
    initAssociationMember()
    loading.hide()
})

const associationUser = ref<AssociationUserDetail | undefined>()

const initAssociationMember = () => {
    associationUser.value = userManagerStore.userAssociations.find(obj => obj.association.id === parseInt(route.params.associationId as string))
}
watch(() => userManagerStore.userAssociations.length, initAssociationMember)

// Get user associations
async function onGetUserAssociations() {
    try {
        await getUserAssociations(parseInt(route.params.userId as string), true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onValidateAssociationUser() {
    try {
        const userId = userManagerStore.user?.id
        const associationId = associationUser.value?.association.id
        await patchUserAssociations(userId, associationId as number, {isValidatedByAdmin: true})
        await router.push({name: 'ValidateAssociationUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-user-association')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onDeleteAssociationUser() {
    try {
        const userId = userManagerStore.user?.id
        const associationId = associationUser.value?.association.id
        await deleteUserAssociation(userId, associationId as number)
        await router.push({name: 'ValidateAssociationUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete-user-association')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <QForm
        @submit.prevent="onValidateAssociationUser"
    >
        <div class="dashboard-section">
            <h2>
                <QIcon name="bi-person"/>
                {{ t('user.infos') }}
            </h2>
            <div class="dashboard-section-container">
                <div class="container">
                    <div class="flex-column">
                        <div class="display-row">
                            <h3>{{ t('user.first-name') }}</h3>
                            <p>{{ userManagerStore.user?.firstName }}</p>
                        </div>
                        <div class="display-row">
                            <h3>{{ t('user.last-name') }}</h3>
                            <p>{{ userManagerStore.user?.lastName }}</p>
                        </div>
                        <div class="display-row">
                            <h3>{{ t('user.email') }}</h3>
                            <p>{{ userManagerStore.user?.email }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-section">
            <h2>
                <QIcon name="bi-person-lines-fill"/>
                {{ t('dashboard.association-user.association') }}
            </h2>

            <div class="dashboard-section-container">
                <div class="container">
                    <div class="flex-column">
                        <div class="display-row">
                            <h3>{{ t('directory.labels.association-name') }}</h3>
                            <p>
                                {{ associationUser?.association.name }}
                            </p>
                        </div>
                        <div class="display-row">
                            <h3>{{ t('directory.labels.association-institution') }}</h3>
                            <p>
                                {{
                                    associationStore.institutions.find(obj => obj.id ===
                                        associationUser?.association.institution)?.name
                                }}
                            </p>
                        </div>
                        <div class="display-row">
                            <h3>{{ t('dashboard.association-user.role') }}</h3>
                            <p v-if="associationUser">
                                {{
                                    associationRoleOptions.find(obj => obj.value === (associationUser ?
                                        getAssociationUserRole(associationUser) : undefined))?.label
                                }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex-row-center padding-top padding-bottom">
            <QBtn
                :label="t('back')"
                :to="{ name: 'ValidateAssociationUsers' }"
                class="btn-lg"
                color="dashboard"
                icon="bi-chevron-compact-left"
            />
            <QBtn
                :label="t('user-manager.delete-association-user')"
                class="btn-lg"
                color="custom-red"
                icon="bi-file-earmark-x"
                @click="onDeleteAssociationUser"
            />
            <QBtn
                :label="t('user-manager.validate-association-user')"
                class="btn-lg"
                color="dashboard"
                icon="bi-check2"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/dashboard.scss';
@import '@/assets/_variables.scss';

/*
.rows-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media screen and (min-width: $responsiveWidth) {
  .q-btn {
    width: 20%;
  }

  .display-row {
    width: 62.5rem;
  }
}*/
</style>
