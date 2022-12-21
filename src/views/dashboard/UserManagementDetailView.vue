<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroups'
import router from '@/router'
import type {User} from '#/user'
import AlertConfirmUserDelete from '@/components/alert/AlertConfirmUserDelete.vue'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import AlertConfirmUserAssociationDelete from '@/components/alert/AlertConfirmUserAssociationDelete.vue'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {getUser, validateUser} = useUsers()
const {groupChoiceIsValid, newGroups} = useUserGroups()

const userManagerStore = useUserManagerStore()
const route = useRoute()

// Watch function observes and updates only if data had been changed
const user = ref<User | undefined>(userManagerStore.user)
watch(() => userManagerStore.user, () => {
    user.value = userManagerStore.user
})

// Boolean select options
const booleanSelectOptions = [
    {
        label: t('yes'),
        value: true
    },
    {
        label: t('no'),
        value: false
    }
]

onMounted(async () => {
    loading.show
    await onGetUser()
    newGroups.value = userManagerStore.userGroups
    await onGetUserAssociations()
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

// Load userAssociations
async function onGetUserAssociations() {
    try {
        await userManagerStore.getUserAssociations()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

// Function that verify if the user is validated by the admin or not, and send the response to the back
async function onValidateUser() {
    if (groupChoiceIsValid.value) {
        try {
            await validateUser(newGroups.value)
            await router.push({name: 'ValidateUsers'})
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
    <h1>{{ t('user-manager.manage-account') }}</h1>
    <QForm
        v-if="user"
        class="q-gutter-md"
        @submit.prevent="register"
    >
        <fieldset>
            <legend>{{ t('user.infos') }}</legend>
            <QInput
                v-model="user.firstName"
                :disable="!!user.isCas"
                :label="t('forms.first-name')"
                :rules="[ val => val && val.length > 0 || t('forms.required-first-name')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="user.lastName"
                :disable="!!user.isCas"
                :label="t('forms.last-name')"
                :rules="[ val => val && val.length > 0 || t('forms.required-last-name')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="user.email"
                :disable="!!user.isCas"
                :label="t('forms.email')"
                :rules="[ (val, rules) => rules.email(val) || t('forms.required-email')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="user.phone"
                :label="t('forms.phone')"
                filled
                hint="Format : 06 00 00 00 00"
                lazy-rules
                mask="## ## ## ## ##"
            />
        </fieldset>
        <fieldset class="association-cards">
            <QCard
                v-for="(association, index) in userManagerStore.userAssociations"
                :key="index"
                class="association-card"
            >
                <QCardSection>
                    <article>
                        <h4>{{ association.association.name }}</h4>
                        <QInput
                            v-model="association.roleName"
                            :label="t('dashboard.association-user.role')"
                            :rules="[ val => val && val.length > 0 || t('forms.required-last-name')]"
                            filled
                            lazy-rules
                        />
                        <QSelect
                            v-model="association.hasOfficeStatus"
                            :label="t('dashboard.association-user.has-office-status')"
                            :options="booleanSelectOptions"
                            emit-value
                            filled
                            map-options
                        />
                        <QSelect
                            v-model="association.isPresident"
                            :label="t('dashboard.association-user.is-president')"
                            :options="booleanSelectOptions"
                            emit-value
                            filled
                            map-options
                        />
                        <AlertConfirmUserAssociationDelete :association-id="association.association.id"/>
                    </article>
                </QCardSection>
            </QCard>
        </fieldset>
        <fieldset>
            <legend>{{ t('user.groups') }}</legend>
            <section>
                <article>
                    <h3>{{ t('user.isCas') }}</h3>
                    <p>{{ user.isCas ? t('yes') : t('no') }}</p>
                </article>
                <article>
                    <h3>{{ t("user.isValidatedByAdmin") }}</h3>
                    <p>{{ user.isValidatedByAdmin ? t('yes') : t('no') }}</p>
                </article>
            </section>
        </fieldset>
        <FormUserGroups/>
    </QForm>
    <section class="btn-group">
        <QBtn :label="t('back')" :to="{name: 'ManageUsers'}" color="secondary" icon="mdi-arrow-left-circle"/>
        <QBtn :label="t('dashboard.validate-changes')" color="primary" icon="mdi-check-circle" @click="onValidateUser"/>
        <AlertConfirmUserDelete/>
    </section>
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

h4
    font-size: 1.5em
    padding: 0
    line-height: 0

.q-select
    margin-bottom: 20px

.association-cards
    display: flex
    flex-direction: column
    gap: 20px
</style>