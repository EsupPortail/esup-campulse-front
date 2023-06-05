<script lang="ts" setup>
import {onMounted, ref, toRefs, watch} from 'vue'
import useUsers from '@/composables/useUsers'
import type {User, UserGroup} from '#/user'
import {useI18n} from 'vue-i18n'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import FormUserAddress from '@/components/form/FormUserAddress.vue'


const {userToUpdate} = useUsers()
const {getGroupLiteral} = useUserGroups()
const {hasPerm} = useSecurity()
const {t} = useI18n()

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
    userToUpdate.value.address = userRef.value.address
    userToUpdate.value.zipcode = userRef.value.zipcode
    userToUpdate.value.city = userRef.value.city
    userToUpdate.value.country = userRef.value.country
}
watch(() => userRef.value, initUserInfos)

const initUserGroups = () => {
    let groups: (string | undefined)[] = []
    props.user?.groups?.forEach((group: UserGroup) => {
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

</script>

<template>
    <fieldset>
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
        <fieldset class="email-modification">
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
                <div class="info-panel info-panel-warning">
                    <i
                            aria-hidden="true"
                            class="bi bi-exclamation-lg"
                    ></i>
                    <p>{{ t('alerts.modify-email') }}</p>
                </div>
            </QExpansionItem>
        </fieldset>
        <QInput
                v-model="userToUpdate.phone"
                :label="t('forms.phone')"
                filled
                hint="Format : 06 00 00 00 00"
                lazy-rules
                mask="## ## ## ## ##"
                type="tel"
        />
        <fieldset
                v-if="(!editedByStaff && hasPerm('add_project_user'))
                || (editedByStaff && userRef.permissions?.includes('add_project_user'))"
        >
            <legend class="title-3">{{ t('address.address') }}</legend>
            <FormUserAddress :user="userRef"/>
        </fieldset>
        <div
                v-if="!editedByStaff"
                class="info-panel info-panel-dashboard"
        >
            <i
                    aria-hidden="true"
                    class="bi bi-info"
            ></i>
            <p class="paragraph">{{ t('dashboard.my-status') }} : <span><strong>{{ userGroups }}</strong></span></p>
            <p class="paragraph">{{ t('dashboard.update-my-status') }}</p>
        </div>
    </fieldset>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import '@/assets/styles/forms.scss';

.q-expansion-item {
  background-color: $dashboardColorBorders;
  padding: 0.625rem;
  margin-bottom: 0.938rem;
}

</style>
