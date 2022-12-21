<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroups'
import router from '@/router'
import AlertConfirmUserDelete from '@/components/alert/AlertConfirmUserDelete.vue'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import FormUpdateManagedUserAssociations from '@/components/form/FormUpdateManagedUserAssociations.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {getUser, updateUserInfos, userToUpdate} = useUsers()
const {groupChoiceIsValid, newGroups} = useUserGroups()

const userManagerStore = useUserManagerStore()
const route = useRoute()


onMounted(async () => {
    loading.show
    await onGetUser()
    //userToUpdate.value = userManagerStore.user
    //newGroups.value = userManagerStore.userGroups
    loading.hide
})

// Load user
async function onGetUser() {
    try {
        await getUser(route.params.id as string)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}


// Function that verify if the user is validated by the admin or not, and send the response to the back
async function onValidateChanges() {
    if (groupChoiceIsValid.value) {
        try {
            await updateUserInfos()
            await router.push({name: 'ManageUsers'})
            notify({
                type: 'positive',
                message: t('notifications.positive.validate-success')
            })
        } catch (e) {
            notify({
                type: 'negative',
                message: t('notifications.negative.unknown-user')
            })
        }
    }
}
</script>

<template>
    <QForm
        v-if="userToUpdate"
        class="q-gutter-md"
        @submit.prevent="onValidateChanges"
    >
        <fieldset>
            <legend>{{ t('user.infos') }}</legend>
            <QInput
                v-model="userToUpdate.firstName"
                :disable="!!userManagerStore.user?.isCas"
                :label="t('forms.first-name')"
                :rules="[ val => val && val.length > 0 || t('forms.required-first-name')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="userToUpdate.lastName"
                :disable="!!userManagerStore.user?.isCas"
                :label="t('forms.last-name')"
                :rules="[ val => val && val.length > 0 || t('forms.required-last-name')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="userToUpdate.email"
                :disable="!!userManagerStore.user?.isCas"
                :label="t('forms.email')"
                :rules="[ (val, rules) => rules.email(val) || t('forms.required-email')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="userToUpdate.phone"
                :label="t('forms.phone')"
                filled
                hint="Format : 06 00 00 00 00"
                lazy-rules
                mask="## ## ## ## ##"
            />
        </fieldset>
        <FormUpdateManagedUserAssociations/>
        <fieldset>
            <legend>{{ t('user.groups') }}</legend>
            <section>
                <article>
                    <h3>{{ t('user.isCas') }}</h3>
                    <p>{{ userManagerStore.user?.isCas ? t('yes') : t('no') }}</p>
                </article>
                <article>
                    <h3>{{ t("user.isValidatedByAdmin") }}</h3>
                    <p>{{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}</p>
                </article>
            </section>
        </fieldset>
        <FormUserGroups/>
        <section class="btn-group">
            <QBtn :label="t('back')" :to="{name: 'ManageUsers'}" color="secondary" icon="mdi-arrow-left-circle"/>
            <QBtn :label="t('dashboard.validate-changes')" color="primary" icon="mdi-check-circle" type="submit"/>
            <AlertConfirmUserDelete/>
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