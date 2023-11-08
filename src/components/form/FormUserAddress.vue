<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import type {User} from '#/user'
import {onMounted, toRefs} from 'vue'

const {t} = useI18n()
const {userToUpdate} = useUsers()

const props = defineProps<{
    user: User | undefined,
    color: 'commission' | 'dashboard',
    editedByStaff: boolean
}>()

const userRef = toRefs(props).user

const initUserInfos = () => {
    userToUpdate.value.address = userRef.value?.address
    userToUpdate.value.zipcode = userRef.value?.zipcode
    userToUpdate.value.city = userRef.value?.city
    userToUpdate.value.country = userRef.value?.country
}

onMounted(initUserInfos)
</script>

<template>
    <div class="flex-column">
        <QInput
            v-model="userToUpdate.address"
            :aria-required="!props.editedByStaff"
            :color="props.color"
            :label="t('address.address') + (props.editedByStaff ? '' : ' *')"
            :rules="props.editedByStaff ? [] : [val => val && val.length > 0 || t('forms.required-address')]"
            autocomplete="street-address"
            clearable
            filled
        />
        <div class="flex-row-center full-width">
            <QInput
                v-model="userToUpdate.zipcode"
                :aria-required="!props.editedByStaff"
                :color="props.color"
                :label="t('address.zipcode') + (props.editedByStaff ? '' : ' *')"
                :rules="props.editedByStaff ? [] : [val => val && val.length > 0 || t('forms.required-zipcode')]"
                autocomplete="postal-code"
                clearable
                filled
            />
            <QInput
                v-model="userToUpdate.city"
                :aria-required="!props.editedByStaff"
                :color="props.color"
                :label="t('address.city') + (props.editedByStaff ? '' : ' *')"
                :rules="props.editedByStaff ? [] : [val => val && val.length > 0 || t('forms.required-city')]"
                autocomplete="address-level2"
                clearable
                filled
            />
            <QInput
                v-model="userToUpdate.country"
                :aria-required="!props.editedByStaff"
                :color="props.color"
                :label="t('address.country') + (props.editedByStaff ? '' : ' *')"
                :rules="props.editedByStaff ? [] : [val => val && val.length > 0 || t('forms.required-country')]"
                autocomplete="country-name"
                clearable
                filled
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.full-width > * {
    width: $fullSize;
}
</style>
