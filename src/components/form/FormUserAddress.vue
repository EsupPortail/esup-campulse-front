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
    <section class="individual-address">
        <QInput
            v-model="userToUpdate.address"
            :label="t('address.address')"
            clearable
            filled
        />
        <div>
            <QInput
                v-model="userToUpdate.zipcode"
                :label="t('address.zipcode')"
                clearable
                filled
            />
            <QInput
                v-model="userToUpdate.city"
                :label="t('address.city')"
                clearable
                filled
            />
            <QInput
                v-model="userToUpdate.country"
                :label="t('address.country')"
                clearable
                filled
            />
        </div>
    </section>
</template>

<style lang="sass" scoped>
.individual-address, .individual-address > div
    display: flex
    gap: 1rem
    flex-direction: column

.individual-address
    margin-top: 1rem
</style>