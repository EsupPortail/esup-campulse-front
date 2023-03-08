<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import axios from 'axios'
import useUsers from '@/composables/useUsers'
import type {User, UserGroup} from '#/user'
import {useI18n} from 'vue-i18n'
import useUserGroups from '@/composables/useUserGroups'
import {useQuasar} from 'quasar'


const {userToUpdate, updateUserInfos} = useUsers()
const {getGroupLiteral} = useUserGroups()
const {t} = useI18n()
const {notify} = useQuasar()

const props = defineProps<{
    user: User,
    editedByStaff: boolean
}>()

const changeEmail = ref<boolean>(false)

const userGroups = ref<string>('')

const initUser = () => {
    userToUpdate.value.firstName = props.user?.firstName
    userToUpdate.value.lastName = props.user?.lastName
    userToUpdate.value.username = props.user?.username
    userToUpdate.value.email = props.user?.email
    userToUpdate.value.newEmail = ''
    userToUpdate.value.newEmailVerification = ''
    userToUpdate.value.phone = props.user?.phone
}

const initUserGroups = () => {
    let groups: (string | undefined)[] = []
    props.user?.groups.forEach((group: UserGroup) => {
        groups.push(getGroupLiteral(group.groupId))
    })
    groups = groups.filter((element, index) => {
        return groups.indexOf(element) === index
    })
    userGroups.value = groups.join(', ')
}
watch(() => props.user, () => {
    initUser()
    initUserGroups()
})

onMounted(() => {
    initUser()
    initUserGroups()
})

async function onUpdateUserInfos() {
    try {
        await updateUserInfos(props.user, props.editedByStaff)
        notify({
            type: 'positive',
            message: t('notifications.positive.update-user-infos')
        })
    } catch (error) {
        if (axios.isAxiosError(error) || error === 500) {
            notify({
                type: 'negative',
                message: t('notifications.negative.email-used')
            })
        }
    }
}
</script>

<template>
    <QForm
        class="q-gutter-md"
        @submit.prevent="onUpdateUserInfos"
    >
        <fieldset>
            <legend>{{ props.editedByStaff ? t('user.infos') : t('dashboard.my-infos') }}</legend>
            <QInput
                v-model="userToUpdate.firstName"
                :disable="!!props.user?.isCas"
                :label="t('forms.first-name')"
                :rules="[val => val && val.length > 0 || t('forms.required-first-name')]"
                filled
                lazy-rules
            />
            <QInput
                v-model="userToUpdate.lastName"
                :disable="!!props.user?.isCas"
                :label="t('forms.last-name')"
                :rules="[val => val && val.length > 0 || t('forms.required-last-name')]"
                filled
                lazy-rules
            />
            <section class="email-modification">
                <QInput
                    v-model="userToUpdate.email"
                    :label="t('forms.email')"
                    :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                    disable
                    filled
                    lazy-rules
                />
                <QExpansionItem
                    v-if="!props.user?.isCas"
                    v-model="changeEmail"
                    :label="t('forms.modify-email')"
                >
                    <QInput
                        v-model="userToUpdate.newEmail"
                        :label="t('forms.new-email')"
                        :rules="changeEmail ? [(val, rules) => rules.email(val) || t('forms.required-new-email')] : []"
                        filled
                        lazy-rules
                    />
                    <QInput
                        v-model="userToUpdate.newEmailVerification"
                        :label="t('forms.repeat-email')"
                        :rules="changeEmail ? [(val, rules) => (rules.email(val) && val === userToUpdate.newEmail) || t('forms.required-repeat-email')] : []"
                        filled
                        lazy-rules
                    />
                    <QBanner class="bg-grey-3">
                        <template v-slot:avatar>
                            <QIcon color="primary" name="mdi-alert-circle"/>
                        </template>
                        <span>{{ t('alerts.modify-email') }}</span>
                    </QBanner>
                </QExpansionItem>
            </section>
            <QInput
                v-model="userToUpdate.phone"
                :label="t('forms.phone')"
                filled
                lazy-rules
                type="tel"
            />
            <QBanner
                v-if="!editedByStaff"
                class="bg-grey-3 status-banner"
            >
                <template v-slot:avatar>
                    <QIcon color="primary" name="mdi-account"/>
                </template>
                <p>Mon statut actuel : <span>{{ userGroups }}</span></p>
                <p>Pour changer de statut, merci de contacter le gestionnaire dont vous dépendez.</p>
            </QBanner>

            <QBtn
                label="Valider les changements"
                type="submit"
            />
        </fieldset>
    </QForm>
</template>

<style lang="sass" scoped>
legend
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center
    width: 100%
    margin-bottom: 10px

fieldset
    border: none

.q-expansion-item
    background-color: #beddff
    padding: 10px
    margin-bottom: 15px

.status-banner
    margin-top: 15px
    margin-bottom: 15px
    padding-top: 20px
</style>