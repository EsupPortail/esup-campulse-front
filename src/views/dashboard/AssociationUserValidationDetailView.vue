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

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {
    getUserAssociations,
    associationRoleOptions,
    getAssociationUserRole,
    patchUserAssociations,
    deleteUserAssociation
} = useUserAssociations()
const associationStore = useAssociationStore()

const userManagerStore = useUserManagerStore()
const route = useRoute()

onMounted(async () => {
    loading.show
    await userManagerStore.getUserDetail(parseInt(route.params.userId as string))
    await onGetUserAssociations()
    await associationStore.getInstitutions()
    initAssociationMember()
    loading.hide
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
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
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
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.invalid-request')
        })
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
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.invalid-request')
        })
    }
}
</script>

<template>
    <QForm
        @submit.prevent="onValidateAssociationUser"
    >
        <section class="dashboard-section">
            <h2>
                <QIcon name="bi-person"/>
                {{ t('user.infos') }}
            </h2>
            <div class="form-container">
                <div class="form">
                    <div class="rows-container">
                        <div class="display-row">
                            <h3 class="row-title">{{ t('user.first-name') }}</h3>
                            <p>{{ userManagerStore.user?.firstName }}</p>
                        </div>
                        <div class="display-row">
                            <h3 class="row-title">{{ t('user.last-name') }}</h3>
                            <p>{{ userManagerStore.user?.lastName }}</p>
                        </div>
                        <div class="display-row">
                            <h3 class="row-title">{{ t('user.email') }}</h3>
                            <p>{{ userManagerStore.user?.email }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="dashboard-section">
            <h2>
                <QIcon name="bi-person-lines-fill"/>
                {{ t('dashboard.association-user.association') }}
            </h2>

            <div class="form-container">
                <div class="form">
                    <div class="rows-container">
                        <div class="display-row">
                            <h3 class="row-title">{{ t('directory.labels.association-name') }}</h3>
                            <p>
                                {{ associationUser?.association.name }}
                            </p>
                        </div>
                        <div class="display-row">
                            <h3 class="row-title">{{ t('directory.labels.association-institution') }}</h3>
                            <p>
                                {{
                                    associationStore.institutions.find(obj => obj.id === associationUser?.association.institution)?.name
                                }}
                            </p>
                        </div>
                        <div class="display-row">
                            <h3 class="row-title">{{ t('dashboard.association-user.role') }}</h3>
                            <p v-if="associationUser">
                                {{
                                    associationRoleOptions.find(obj => obj.value === getAssociationUserRole(associationUser))?.label
                                }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="form-page-navigation">
            <QBtn
                :label="t('back')"
                :to="{ name: 'ValidateAssociationUsers' }"
                color="secondary"
                icon="bi-chevron-compact-left"
            />
            <QBtn
                :label="t('user-manager.delete-association-user')"
                color="red"
                icon="bi-file-earmark-x"
                @click="onDeleteAssociationUser"
            />
            <QBtn
                :label="t('user-manager.validate-association-user')"
                color="primary"
                icon-right="bi-check2"
                type="submit"
            />
        </section>
    </QForm>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
@import '@/assets/styles/dashboard.scss'
@import '@/assets/styles/user-validation-detail.scss'
</style>