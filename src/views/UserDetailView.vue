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
const {getUser, validateUser, deleteUser} = useUsers()
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

async function onDeleteUser() {
    try {
        await deleteUser()
        await router.push({name: 'ValidateUsers'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-delete')
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
    <section>
        <h2>{{ t("user.title-infos") }}</h2>
        <article>
            <h3>{{ t("user.first-name") }}</h3>
            <p>{{ userManagerStore.user?.firstName }}</p>
        </article>
        <article>
            <h3>{{ t("user.last-name") }}</h3>
            <p>{{ userManagerStore.user?.lastName }}</p>
        </article>
        <article>
            <h3>{{ t("user.email") }}</h3>
            <p>{{ userManagerStore.user?.email }}</p>
        </article>
        <article>
            <h3>{{ t("user.phone") }}</h3>
            <p>{{ userManagerStore.user?.phone }}</p>
        </article>
        <article>
            <h3>{{ t("user.isCas") }}</h3>
            <p>{{ userManagerStore.user?.isCas ? "Oui" : "Non" }}</p>
        </article>
        <article>
            <h3>{{ t("user.isValidatedByAdmin") }}</h3>
            <p>{{ userManagerStore.user?.isValidatedByAdmin ? "Oui" : "Non" }}</p>
        </article>
    </section>
    <section>
        <h2>{{ t("user.title-group") }}</h2>
        <fieldset>
            <QField v-if="groupList"
                    :error="!groupChoiceIsValid"
                    :error-message="t('forms.required-status')"
                    :hint="t('forms.status-hint')"
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
        <QBtn color="secondary" label="Retour" to="/users"/>
        <QBtn color="primary" label="Valider" @click="onValidateUser"/>
        <QBtn color="red" label="Supprimer" @click="onDeleteUser"/>
    </section>
</template>

<style lang="sass" scoped>
.title
    display: flex
    gap: 20px
    margin-top: 50px
    align-items: flex-start

    .name
        h1
            font-size: 3em
            line-height: 0

        span
            font-size: 1.5em

    .logo
        max-width: 150px
        width: 100%
        height: 150px
        background-color: grey

.description
    margin-top: 30px

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

.q-btn
    margin: 20px 0

.btn-group
    display: flex
    gap: 10px

fieldset
    border: none
</style>