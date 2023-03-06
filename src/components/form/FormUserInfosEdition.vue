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
            message: 'Les informations du compte ont bien été mises à jour.'
        })
    } catch (error) {
        if (axios.isAxiosError(error) || error === 500) {
            notify({
                type: 'negative',
                message: 'Cette adresse mail est déjà associée à un compte et ne peut pas être utilisée.'
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
            <legend>{{ t('user.infos') }}</legend>
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
                    label="Modifier l'adresse mail"
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
                    <span>Attention, l'adresse mail est utilisée comme identifiant pour se connecter. En cas de modification, elle deviendra le nouvel identifiant du compte.
                Un mail de vérification sera envoyé sur cette adresse pour la valider.</span>
                </QExpansionItem>
            </section>
            <QInput
                v-model="userToUpdate.phone"
                :label="t('forms.phone')"
                filled
                lazy-rules
                type="tel"
            />
            <section v-if="!editedByStaff">
                <p>Mon statut actuel : <span>{{ userGroups }}</span></p>
                <p>Pour changer de statut, merci de contacter le gestionnaire dont vous dépendez.</p>
            </section>
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
</style>