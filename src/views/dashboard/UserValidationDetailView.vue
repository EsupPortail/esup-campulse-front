<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import useUsers from '@/composables/useUsers'
import {useRoute} from 'vue-router'
import router from '@/router'
import FormUserGroups from '@/components/form/FormUserGroups.vue'
import useUserGroups from '@/composables/useUserGroups'
import useUserAssociations from "@/composables/useUserAssociations";

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {validateUser} = useUsers()
const {newGroups, groupChoiceIsValid} = useUserGroups()
const {getUserAssociations} = useUserAssociations()

const userManagerStore = useUserManagerStore()
const route = useRoute()

onMounted(async () => {
    loading.show
    await onGetUser()
    newGroups.value = userManagerStore.userGroups
    await onGetUserAssociations()
    loading.hide
})

// Get user
async function onGetUser() {
    try {
        await userManagerStore.getUserDetail(parseInt(route.params.id as string))
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

// Get user associations
async function onGetUserAssociations() {
    try {
        await getUserAssociations(userManagerStore.user?.id as number, true)
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.loading-error')
        })
    }
}

// Function that verify if the user is validated by the admin or not, and send the response to the back
async function onValidateUser() {
    if (groupChoiceIsValid.value) {
        try {
            await validateUser()
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
            <h3>{{ t('user.is-cas') }}</h3>
            <p>{{ userManagerStore.user?.isCas ? t('yes') : t('no') }}</p>
        </article>
        <article>
            <h3>{{ t('user.is-validated-by-admin') }}</h3>
            <p>{{ userManagerStore.user?.isValidatedByAdmin ? t('yes') : t('no') }}</p>
        </article>
    </section>
    <section>
        <h2>{{ t('directory.title') }}</h2>
        <div v-if="userManagerStore.userAssociations.length">
            <article v-for="(association, index) in userManagerStore.userAssociations" :key="index">
                <h3>{{ association.association.name }}</h3>
                <ul>
                    <li>{{ t('dashboard.association-user.is-president') }} :
                        {{ association.isPresident ? t('yes') : t('no') }}
                    </li>
                    <li>{{ t('dashboard.association-user.can-be-president') }} :
                        {{ association.canBePresident ? t('yes') : t('no') }}
                    </li>
                    <li>{{ t('dashboard.association-user.is-secretary') }} :
                        {{ association.isSecretary ? t('yes') : t('no') }}
                    </li>
                    <li>{{ t('dashboard.association-user.is-treasurer') }} :
                        {{ association.isTreasurer ? t('yes') : t('no') }}
                    </li>
                </ul>
            </article>
        </div>
        <div v-else>
            <p>{{ t('dashboard.association-user.not-association-member') }}</p>
        </div>
    </section>
    <section>
        <h2>{{ t("user.groups") }}</h2>
        <FormUserGroups/>
    </section>
    <section class="btn-group">
        <QBtn :label="t('back')" :to="{ name: 'ValidateUsers' }" color="secondary" icon="mdi-arrow-left-circle"/>
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
    margin-top: 10px
    margin-bottom: 30px

fieldset
    border: none

ul
    padding-left: 15px
</style>
