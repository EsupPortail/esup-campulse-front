<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import type {User} from '#/user'
import {onMounted, toRefs} from 'vue'

const {t} = useI18n()
const {userToUpdate} = useUsers()

const props = defineProps<{
    user: User,
    color: 'commission' | 'dashboard'
}>()

const userRef = toRefs(props).user

const initUserInfos = () => {
    userToUpdate.value.address = userRef.value.address
    userToUpdate.value.zipcode = userRef.value.zipcode
    userToUpdate.value.city = userRef.value.city
    userToUpdate.value.country = userRef.value.country
}

onMounted(initUserInfos)
</script>

<template>
    <div class="flex-column">
        <QInput
            v-model="userToUpdate.address"
            :color="props.color"
            :label="t('address.address') + ' *'"
            :rules="[val => val && val.length > 0 || t('forms.required-address')]"
            aria-required="true"
            autocomplete="street-address"
            clearable
            filled
        />
        <div class="flex-row-center full-width">
            <QInput
                v-model="userToUpdate.zipcode"
                :color="props.color"
                :label="t('address.zipcode') + ' *'"
                :rules="[val => val && val.length > 0 || t('forms.required-zipcode')]"
                aria-required="true"
                autocomplete="postal-code"
                clearable
                filled
            />
            <QInput
                v-model="userToUpdate.city"
                :color="props.color"
                :label="t('address.city') + ' *'"
                :rules="[val => val && val.length > 0 || t('forms.required-city')]"
                aria-required="true"
                autocomplete="address-level2"
                clearable
                filled
            />
            <QInput
                v-model="userToUpdate.country"
                :color="props.color"
                :label="t('address.country') + ' *'"
                :rules="[val => val && val.length > 0 || t('forms.required-country')]"
                aria-required="true"
                autocomplete="country-name"
                clearable
                filled
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.full-width > * {
    width: 100%;
}
</style>
