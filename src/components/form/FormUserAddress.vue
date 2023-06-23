<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useUsers from '@/composables/useUsers'
import type {User} from '#/user'
import {onMounted, toRefs} from 'vue'

const {t} = useI18n()
const {userToUpdate} = useUsers()

const props = defineProps<{
    user: User
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
            :label="t('address.address')"
            autocomplete="street-address"
            clearable
            color="commission"
            filled
        />
        <div class="flex-row-center full-width">
            <QInput
                v-model="userToUpdate.zipcode"
                :label="t('address.zipcode')"
                autocomplete="postal-code"
                clearable
                color="commission"
                filled
            />
            <QInput
                v-model="userToUpdate.city"
                :label="t('address.city')"
                autocomplete="address-level2"
                clearable
                color="commission"
                filled
            />
            <QInput
                v-model="userToUpdate.country"
                :label="t('address.country')"
                autocomplete="country-name"
                clearable
                color="commission"
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
