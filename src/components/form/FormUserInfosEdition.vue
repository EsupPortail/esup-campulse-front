<script lang="ts" setup>
import {onMounted, ref, toRefs, watch} from 'vue'
import useUsers from '@/composables/useUsers'
import type {User, UserGroup} from '#/user'
import {useI18n} from 'vue-i18n'
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import FormUserAddress from '@/components/form/FormUserAddress.vue'
import InfoFormRequiredFields from '@/components/infoPanel/InfoFormRequiredFields.vue'


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
    <div class="flex-column">
        <InfoFormRequiredFields/>
        <QInput
            v-model="userToUpdate.firstName"
            :disable="!!props.user?.isCas"
            :label="t('forms.first-name') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-first-name')]"
            autocomplete="given-name"
            color="dashboard"
            filled
            lazy-rules
            @focus="() => { variant = Variant.Home }"
        />
        <QInput
            v-model="userToUpdate.lastName"
            :disable="!!props.user?.isCas"
            :label="t('forms.last-name') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-last-name')]"
            autocomplete="family-name"
            color="dashboard"
            filled
            lazy-rules
        />
        <QInput
            v-model="userToUpdate.email"
            :label="t('forms.email') + ' *'"
            :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
            autocomplete="email"
            color="dashboard"
            disable
            filled
            lazy-rules
        />
        <QExpansionItem
            v-if="!props.user?.isCas"
            v-model="changeEmail"
            :label="t('forms.modify-email')"
            header-class="text-dashboard"
        >
            <QInput
                v-model="userToUpdate.newEmail"
                :label="t('forms.new-email')"
                :rules="changeEmail ? [(val, rules) => rules.email(val) || t('forms.required-new-email')] : []"
                autocomplete="email"
                class="padding-top"
                color="dashboard"
                filled
                lazy-rules
            />
            <QInput
                v-model="userToUpdate.newEmailVerification"
                :label="t('forms.repeat-email')"
                :rules="changeEmail ? [(val, rules) => (rules.email(val) && val === userToUpdate.newEmail) || t('forms.required-repeat-email')] : []"
                autocomplete="email"
                color="dashboard"
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
        <QInput
            v-model="userToUpdate.phone"
            :label="t('forms.phone')"
            autocomplete="tel"
            color="dashboard"
            filled
            hint="Format : 06 00 00 00 00"
            lazy-rules
            mask="## ## ## ## ##"
            type="tel"
        />
        <div
            v-if="(!editedByStaff && hasPerm('add_project_user'))
                || (editedByStaff && userRef.permissions?.includes('add_project_user'))"
        >
            <h3>{{ t('address.address') }}</h3>
            <FormUserAddress
                :user="userRef"
                color="dashboard"
            />
        </div>
        <div
            v-if="!editedByStaff"
            class="info-panel info-panel-dashboard"
        >
            <i
                aria-hidden="true"
                class="bi bi-info"
            ></i>
            <p>{{ t('dashboard.my-status') }} : <span><strong>{{ userGroups }}</strong></span></p>
            <p>{{ t('dashboard.update-my-status') }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';


q-input:focus {
  color: red;
  background-color: yellow;
}
</style>
