<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onBeforeRouteLeave, useRoute} from 'vue-router'
import AlertConfirmUserDelete from '@/components/alert/AlertConfirmUserDelete.vue'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import FormUpdateManagedUserAssociations from '@/components/form/FormUpdateManagedUserAssociations.vue'
import type {UserToUpdate} from '#/user'
import useUserGroups from '@/composables/useUserGroups'
import router from '@/router'
import AlertLeaveEdition from '@/components/alert/AlertLeaveEdition.vue'
import AlertConfirmUserUpdate from "@/components/alert/AlertConfirmUserUpdate.vue";

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {groupChoiceIsValid} = useUserGroups()

const userManagerStore = useUserManagerStore()
const route = useRoute()


const user = ref<UserToUpdate>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: ''
})

const initValues = () => {
    user.value.firstName = userManagerStore.user?.firstName
    user.value.lastName = userManagerStore.user?.lastName
    user.value.username = userManagerStore.user?.username
    user.value.email = userManagerStore.user?.email
    user.value.phone = userManagerStore.user?.phone as string
}
watch(() => userManagerStore.user, initValues)


onMounted(async () => {
    loading.show
    await onGetUser()
    initValues()
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
    if (!hasValidated.value) {
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
    <QForm class="q-gutter-md">
        <fieldset>
            <legend>{{ t('user.infos') }}</legend>
            <QInput
                v-model="user.firstName"
                :disable="!!userManagerStore.user?.isCas"
                :label="t('forms.first-name')"
                :rules="[val => val && val.length > 0 || t('forms.required-first-name')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="user.lastName"
                :disable="!!userManagerStore.user?.isCas"
                :label="t('forms.last-name')"
                :rules="[val => val && val.length > 0 || t('forms.required-last-name')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="user.email"
                :disable="!!userManagerStore.user?.isCas"
                :label="t('forms.email')"
                :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="user.phone"
                :label="t('forms.phone')"
                filled
                lazy-rules
                type="tel"
            />
        </fieldset>
        <FormUpdateManagedUserAssociations/>
        <fieldset>
            <legend>{{ t('user.groups') }}</legend>
            <section>
                <article>
                    <h3>{{ t('user.is-cas') }}</h3>
                    <p>{{ userManagerStore.user?.isCas ? t('yes') : t('no') }}</p>
                </article>
                <article>
                    <h3>{{ t("user.is-validated-by-admin") }}</h3>
                    <p>{{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}</p>
                </article>
            </section>
        </fieldset>
        <FormUserGroups/>
        <section class="btn-group">
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
                :user="user"
                @has-validated="hasValidated = true"
            />
            <AlertConfirmUserDelete @has-validated="hasValidated = true"/>
        </section>
    </QForm>
</template>

<style lang="sass" scoped>
section
    article > *
        margin: 0
        width: 50%

    article
        display: flex
        align-items: center
        background-color: lightgrey
        padding: 0 20px 0 20px
        margin: 5px 0

        h3
            font-size: 1.2em
            text-transform: uppercase

legend
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center
    width: 100%
    margin-bottom: 10px

.btn-group
    display: flex
    gap: 20px
    margin: 30px 0 30px 0

fieldset
    border: none
</style>
