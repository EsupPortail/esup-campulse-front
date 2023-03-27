<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import AlertConfirmUserDelete from '@/components/alert/AlertConfirmUserDelete.vue'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import useUserGroups from '@/composables/useUserGroups'
import router from '@/router'
import AlertLeaveEdition from '@/components/alert/AlertLeaveEdition.vue'
import AlertConfirmUserUpdate from '@/components/alert/AlertConfirmUserUpdate.vue'
import FormUserInfosEdition from '@/components/form/FormUserInfosEdition.vue'
import FormUpdateUserAssociations from '@/components/form/FormUpdateUserAssociations.vue'
import FormRegisterUserAssociations from "@/components/form/FormRegisterUserAssociations.vue";
import {useUserStore} from "@/stores/useUserStore";

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {groupChoiceIsValid} = useUserGroups()

const userManagerStore = useUserManagerStore()
const userStore = useUserStore()
const route = useRoute()

onMounted(async () => {
    loading.show
    await onGetUser()
    loading.hide
})

// Load user
async function onGetUser() {
    try {
        await userManagerStore.getUserDetail(parseInt(route.params.id as string))
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

// Open alert if user leaves
const openAlert = ref<boolean>(false)
const leaveEdition = ref<boolean>(false)
const hasValidated = ref<boolean>(false)

function onLeaveEdition() {
    leaveEdition.value = true
    router.push({name: 'ManageUsers'})
}

// Check is there are any changes before leaving the page
onBeforeRouteLeave((to, from, next) => {
    // We open pop-up if manager has nos validated changes and manager is auth (to prevent pop-up to open on logout)
    if (!hasValidated.value && userStore.isAuth) {
        openAlert.value = true
        if (!leaveEdition.value) {
            next(false)
        } else {
            next(true)
        }
    } else {
        next(true)
    }
})
</script>

<template>
    <QForm
        v-if="userManagerStore.user"
        class="q-gutter-md"
        @submit.prevent="openAlert = true"
    >
        <section class="association-cards dashboard-section">
            <div class="form-title">
                <h2>
                    <i aria-hidden="true" class="bi bi-pencil-square"></i>
                    {{ t('user-manager.user-infos') }}
                </h2>
            </div>

            <div class="form-container">
                <div class="form">
                    <FormUserInfosEdition :edited-by-staff="true" :user="userManagerStore.user"/>
                </div>
            </div>
        </section>

        <section class="association-cards dashboard-section">
            <div class="form-title">
                <h2>
                    <i aria-hidden="true" class="bi bi-pencil-square"></i>
                    {{ t('user-manager.user-associations') }}
                </h2>
            </div>

            <div class="form-container">
                <div class="form">
                    <FormUpdateUserAssociations/>
                    <FormRegisterUserAssociations/>
                </div>
            </div>
        </section>

        <section class="dashboard-section">
            <div class="form-title">
                <h2>
                    <QIcon name="bi-person-lines-fill"/>
                    {{ t('user-manager.user-status') }}
                </h2>
            </div>
            <div class="form-container">
                <div class="form">
                    <FormUserGroups/>
                    <ul>
                        <li>
                            <strong>{{ t('user.is-cas') }}</strong> :
                            {{ userManagerStore.user?.isCas ? t('yes') : t('no') }}
                        </li>
                        <li>
                            <strong>{{ t("user.is-validated-by-admin") }}</strong> :
                            {{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <section class="form-page-navigation">
            <QBtn
                :label="t('back')"
                color="secondary"
                icon="mdi-arrow-left-circle"
                @click="openAlert = true"
            />
            <AlertLeaveEdition
                :open-alert="openAlert"
                :text="t('alerts.leave-user-edition')"
                @closeAlert="openAlert = !openAlert"
                @leaveEdition="onLeaveEdition"
            />
            <AlertConfirmUserUpdate
                v-if="groupChoiceIsValid"
                @has-validated="hasValidated = true"
            />
            <AlertConfirmUserDelete @has-validated="hasValidated = true"/>
        </section>
    </QForm>
</template>

<style lang="sass" scoped>
ul
    margin-left: 1rem
    list-style: none
</style>
