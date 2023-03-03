<script lang="ts" setup>
import useUsers from '@/composables/useUsers'
import type {User} from '#/user'
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'

const {user} = useUsers()
const {t} = useI18n()

const props = defineProps<{
    user: User,
    editedByStaff: boolean
}>()

const changeEmail = ref<boolean>(false)
</script>

<template>
    <fieldset>
        <legend>{{ t('user.infos') }}</legend>
        <QInput
            v-model="user.firstName"
            :disable="!!props.user?.isCas"
            :label="t('forms.first-name')"
            :rules="[val => val && val.length > 0 || t('forms.required-first-name')]"
            filled
            lazy-rules
        />
        <QInput
            v-model="user.lastName"
            :disable="!!props.user?.isCas"
            :label="t('forms.last-name')"
            :rules="[val => val && val.length > 0 || t('forms.required-last-name')]"
            filled
            lazy-rules
        />
        <section> <!-- Email change section -->
            <!-- Simple input for staff edition or if user isCas (but disabled) -->
            <QInput
                v-if="props.editedByStaff || props.user?.isCas"
                v-model="user.email"
                :disable="!!props.user?.isCas"
                :label="t('forms.email')"
                :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                filled
                lazy-rules
            />
            <!-- Allow modification with verification for users -->
            <section
                v-if="!props.editedByStaff && !props.user?.isCas"
            >
                <p>Adresse mail : {{ props.user?.email }}</p>

                <QBtn
                    label="Modifier mon adresse mail"
                    @click="changeEmail = true"
                />

                <fieldset v-if="changeEmail">
                    <legend>Modifier mon adresse mail</legend>
                    <QInput
                        v-model="user.email"
                        :disable="!!props.user?.isCas"
                        :label="t('forms.email')"
                        :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                        filled
                        lazy-rules
                    />
                    <QInput
                        v-model="user.email"
                        :disable="!!props.user?.isCas"
                        :label="t('forms.email')"
                        :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                        filled
                        lazy-rules
                    />
                </fieldset>
            </section>
        </section>
        <QInput
            v-model="user.phone"
            :label="t('forms.phone')"
            filled
            lazy-rules
            type="tel"
        />
    </fieldset>
</template>