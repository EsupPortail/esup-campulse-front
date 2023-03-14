<script lang="ts" setup>
import {onMounted, ref, toRefs, watch} from 'vue'
import axios from 'axios'
import useUsers from '@/composables/useUsers'
import type {User, UserGroup} from '#/user'
import {useI18n} from 'vue-i18n'
import useUserGroups from '@/composables/useUserGroups'
import {useQuasar} from 'quasar'


const {userToUpdate, updateUserInfos, infosToPatch, initInfosToPatch} = useUsers()
const {getGroupLiteral} = useUserGroups()
const {t} = useI18n()
const {notify} = useQuasar()

const props = defineProps<{
    editedByStaff: boolean,
    user: User
}>()

const userRef = toRefs(props).user

const changeEmail = ref<boolean>(false)

const userGroups = ref<string>('')

const initUserInfos = () => {
    userToUpdate.value.firstName = userRef.value.firstName
    userToUpdate.value.lastName = userRef.value.lastName
    userToUpdate.value.username = userRef.value.username
    userToUpdate.value.email = userRef.value.email
    userToUpdate.value.newEmail = ''
    userToUpdate.value.newEmailVerification = ''
    userToUpdate.value.phone = userRef.value.phone
}
watch(() => userRef.value, initUserInfos)

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
watch(() => userRef.value, () => {
    initUserInfos()
    initUserGroups()
})

onMounted(() => {
    initUserInfos()
    initUserGroups()
})

async function onUpdateUserInfos() {
    try {
        initInfosToPatch(userRef.value)
        if (Object.entries(infosToPatch).length !== 0) {
            await updateUserInfos(userRef.value, props.editedByStaff)
            notify({
                type: 'positive',
                message: t('notifications.positive.update-user-infos')
            })
        } else {
            notify({
                type: 'warning',
                message: t('notifications.warning.no-modifications-found')
            })
        }
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
                hint="Format : 06 00 00 00 00"
                lazy-rules
                mask="## ## ## ## ##"
                type="tel"
            />
            <QBanner
                v-if="!editedByStaff"
                class="bg-grey-3 status-banner"
            >
                <template v-slot:avatar>
                    <QIcon color="primary" name="mdi-account"/>
                </template>
                <p>{{ t('dashboard.my-status') }} <span>{{ userGroups }}</span></p>
                <p>{{ t('dashboard.update-my-status') }}</p>
            </QBanner>

            <QBtn
                v-if="!props.editedByStaff"
                :label="t('validate-changes')"
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
