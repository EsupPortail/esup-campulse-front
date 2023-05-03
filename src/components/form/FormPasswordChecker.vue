<script lang="ts" setup>
import type {PasswordChecker} from '#/index'
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'

const props = defineProps<{
    passwordChecker: PasswordChecker
}>()

const {t} = useI18n()
const {passwordMinLength} = useSecurity()
</script>
<template>
    <p class="paragraph">{{ t('password.policy.must-contain') }}</p>
    <ul>
        <li
            v-for="(test, index) in props.passwordChecker.tests"
            :key="index"
        >
            <span class="form-state">
                <span
                    :class="`form-state-icon form-state-${test.valid ? 'green' : 'red'}`"
                    aria-hidden="true"
                ><i :class="`bi bi-${test.valid ? 'check' : 'x'}`"></i></span>
                {{
                    (index === 0 ? (passwordMinLength + ' ') : '') + t(`password.policy.${test.message}`) + ' ' + test.additionalMessage
                }}
            </span>
        </li>
    </ul>
</template>

<style lang="sass" scoped>
@import "@/assets/styles/forms.scss"
</style>