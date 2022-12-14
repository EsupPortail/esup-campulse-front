<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import useUserGroups from '@/composables/useUserGroups'
import router from '@/router'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {getUser, validateUser} = useUsers()
const {getGroups, groupList} = useUserGroups()

const userManagerStore = useUserManagerStore()
const route = useRoute()


// watch function observes and updates only if data had been changed.
const userGroups = ref<number[]>(userManagerStore.userGroups)

watch(() => userManagerStore.userGroups, () => {
    userGroups.value = userManagerStore.userGroups
})

// Check if the user has enough roles or not
const groupChoiceIsValid = computed<boolean>(() => {
    return userGroups.value.length > 0 && userGroups.value.length <= 2
})

onMounted(async () => {
    loading.show
    await onGetUser()
    await onLoadGroups()
    loading.hide
})

// Load group list
async function onLoadGroups() {
    try {
        await getGroups()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
    }
}

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
async function onValidateUser() {
    if (groupChoiceIsValid.value) {
        try {
            await validateUser(userGroups.value)
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

async function onDeleteUser() {
    try {
        await userManagerStore.deleteUser()
        await router.push({name: 'ValidateUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete-user')
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.unknown-user')
        })
    }
}
</script>

<template>
    <h1>{{ t('user-manager.validate-account') }}</h1>
    <section>
        <h2>{{ t('user.infos') }}</h2>
        <article>
            <h3>{{ t('user.first-name') }}</h3>
            <p>{{ userManagerStore.user?.firstName }}</p>
        </article>
        <article>
            <h3>{{ t('user.last-name') }}</h3>
            <p>{{ userManagerStore.user?.lastName }}</p>
        </article>
        <article>
            <h3>{{ t('user.email') }}</h3>
            <p>{{ userManagerStore.user?.email }}</p>
        </article>
        <article>
            <h3>{{ t('user.phone') }}</h3>
            <p>{{ userManagerStore.user?.phone }}</p>
        </article>
        <article>
            <h3>{{ t('user.isCas') }}</h3>
            <p>{{ userManagerStore.user?.isCas ? t('yes') : t('no') }}</p>
        </article>
        <article>
            <h3>{{ t("user.isValidatedByAdmin") }}</h3>
            <p>{{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}</p>
        </article>
    </section>
    <section>
        <h2>{{ t("user.groups") }}</h2>
        <fieldset>
            <QField v-if="groupList"
                    :error="!groupChoiceIsValid"
                    :error-message="t('user-manager.forms.required-status')"
                    :hint="t('user-manager.forms.status-hint')"
            >
                <QOptionGroup
                    v-model="userGroups"
                    :options="groupList"
                    color="primary"
                    type="checkbox"
                />
            </QField>
        </fieldset>
    </section>
    <section class="btn-group">
        <QBtn :label="t('back')" color="secondary" icon="mdi-arrow-left-circle" to="/dashboard/validate-users"/>
        <QBtn :label="t('user-manager.validate-account')" color="primary" icon="mdi-check-circle"
              @click="onValidateUser"/>
        <QBtn :label="t('user-manager.delete-account-application')" color="red" icon="mdi-delete"
              @click="onDeleteUser"/>
    </section>
</template>

<style lang="sass" scoped>
h2
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center

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

.btn-group
    display: flex
    gap: 20px

fieldset
    border: none
</style>