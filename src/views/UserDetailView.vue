<script lang="ts" setup>
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {computed, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useRoute} from 'vue-router'
import type {User} from '#/user'
import {useUserStore} from "@/stores/useUserStore";

const {t} = useI18n()
const {notify} = useQuasar()

const route = useRoute()
const userStore = useUserStore()
const userManager = useUserManagerStore()

const user = ref<User>()
const userGroups = ref<number[]>(userManager.userGroups)

watch(() => userManager.userGroups, () => {
    userGroups.value = userManager.userGroups
})

const groupChoiceIsValid = computed<boolean>(() => {
    return userGroups.value.length > 0 && userGroups.value.length <= 2
})

const {loading} = useQuasar()
onMounted(async () => {
    loading.show
    await getUser()
    await loadGroups()
    loading.hide
})

// Load group list
async function loadGroups() {
    try {
        await userStore.getGroups()
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })

    }
}

// Load user
async function getUser() {
    if (route.params.id) {
        try {
            const id = parseInt(route.params.id as string)
            await userManager.getUserDetail(id)
            user.value = userManager.user
        } catch (e) {
            notify({
                type: 'negative',
                message: t('notifications.negative.form-error')
            })
        }
    }
}

async function validateUser(user: User) {
    try {
        await userManager.validateUser(user.id, {
            isValidatedByAdmin: user.isValidatedByAdmin, id: 0
        })
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

</script>

<template>
    <div v-if="!user">Loading...</div>
    <div v-else>
        <div class="title">
            <div class="name">
                <h1>{{ userManager.user.firstName }} {{ userManager.user.lastName }} </h1>
            </div>
        </div>

        <div class="cardbox">
            <h2>{{ $t("user.title-infos") }}</h2>

            <div class="cardbox-item">
                <h3>{{ $t("user.first-name") }}</h3>
                <p>{{ userManager.user.firstName }}</p>
            </div>

            <div class="cardbox-item">
                <h3>{{ $t("user.last-name") }}</h3>
                <p>{{ userManager.user.lastName }}</p>
            </div>

            <div class="cardbox-item">
                <h3>{{ $t("user.email") }}</h3>
                <p>{{ userManager.user.email }}</p>
            </div>

            <div class="cardbox-item">
                <h3>{{ $t("user.phone") }}</h3>
                <p>{{ userManager.user.phone }}</p>
            </div>

            <div class="cardbox-item">
                <h3>{{ $t("user.isCas") }}</h3>
                <p>{{ userManager.user.isCas ? "Oui" : "Non" }}</p>
            </div>

            <div class="cardbox-item">
                <h3>{{ $t("user.isValidatedByAdmin") }}</h3>
                <p>{{ userManager.user.isValidatedByAdmin ? "Oui" : "Non" }}</p>
            </div>
        </div>

        <div class="cardbox">
            <h2>{{ $t("user.title-group") }}</h2>
            <fieldset>
                <QField
                    :error="!groupChoiceIsValid"
                    :error-message="$t('forms.required-status')"
                    :hint="$t('forms.status-hint')"
                >
                    <QOptionGroup
                        v-model="userGroups"
                        :options="userStore.groupList"
                        color="primary"
                        type="checkbox"
                    />
                </QField>
            </fieldset>

        </div>
        <QBtn color="secondary" label="Valider" v-on:click="validateUser(userManager.user)"/>
        <QBtn color="secondary" label="Annuler" to="/users"/>
    </div>
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

.cardbox
    .cardbox-item > *
        margin: 0
        width: 50%

    .cardbox-item
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

</style>