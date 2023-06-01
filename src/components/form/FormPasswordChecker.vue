<script lang="ts" setup>
import type {PasswordChecker} from '#/index'
import {useI18n} from 'vue-i18n'
import useSecurity from '@/composables/useSecurity'
import {ref, watch} from 'vue'

const props = defineProps<{
    passwordChecker: PasswordChecker,
    password: string | null
}>()

const {t} = useI18n()
const {passwordMinLength} = useSecurity()

const resultClasses = ref<string[]>([])

const initResultClasses = () => {
    const score = props.passwordChecker.score
    const total = 4
    const classes = [`__${score}`]
    for (let i = 0; i < score; i++) {
        classes.push(`__${score}`)
    }
    for (let i = 0; i < total - score; i++) {
        classes.push('__neutral')
    }
    resultClasses.value = classes
}

watch(() => props.password, initResultClasses)

const resultLabels = [
    {
        score: 0,
        label: t('password.policy.labels.very-low')
    },
    {
        score: 1,
        label: t('password.policy.labels.low')
    },
    {
        score: 2,
        label: t('password.policy.labels.moderate')
    },
    {
        score: 3,
        label: t('password.policy.labels.strong')
    },
    {
        score: 4,
        label: t('password.policy.labels.very-strong')
    }
]
</script>
<template>
    <section
            v-if="password"
            class="password-feedback"
    >
        <div class="password-feedback-bar">
            <div
                    v-for="(item, index) in resultClasses"
                    :key="index"
                    :class="item"
            >
            </div>
        </div>
        <div>
            <p :class="`paragraph __${props.passwordChecker.score}`">
                {{ resultLabels.find(label => label.score === props.passwordChecker.score)?.label }}
            </p>
        </div>
    </section>
    <section class="password-rules">
        <p class="paragraph">{{ t('password.policy.must-contain') }}</p>
        <ul>
            <li
                    v-for="(test, index) in props.passwordChecker.tests"
                    :key="index"
            >
                <span class="form-state">
                    <span :class="`form-state-icon form-state-${test.valid ? 'green' : 'red'}`" aria-hidden="true">
                        <i :class="`bi bi-${test.valid ? 'check' : 'x'}`"></i>
                    </span>
                    <div class="test">
                        {{
                            (index === 0 ? (passwordMinLength + ' ') : '') + t(`password.policy.${test.message}`) + ' ' + test.additionalMessage
                        }}
                    </div>
                </span>
            </li>
        </ul>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";

.password-feedback {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-top: 0;
}

p {
  margin: 0;
  font-size: 0.9rem;
}

.form-state {
  display: flex;

  i {
    width: 1.5rem;
  }

  .test {
    padding: 0 0 0 0.5rem;
    font-size: 0.9rem;
  }
}


.password-feedback-bar {
  display: flex;
  justify-content: space-around;
  flex-flow: row wrap;
  align-items: stretch;
  gap: 0.3rem;
  flex-grow: 1;

}

.password-feedback-bar > div {
  width: 1rem;
  flex-grow: 1;
  height: 0.3rem;
  background-color: lightgrey;
  border-radius: 1rem;
  box-shadow: 0.125rem 0.125rem 0.5rem rgba(0, 0, 0, 0.1);
  transition-duration: 0.3s;
}

.password-feedback-bar > .__0 {
  background-color: #7a2520;
}

.password-feedback-bar > .__1 {
  background-color: #db463d;
}

.password-feedback-bar > .__2 {
  background-color: #e7902a;
}

.password-feedback-bar > .__3 {
  background-color: #ffc64a;
}

.password-feedback-bar > .__4 {
  background-color: #5cc887;
}

.paragraph.__0 {
  color: #7a2520;
}

.paragraph.__1 {
  color: #db463d;
}

.paragraph.__2 {
  color: #e7902a;
}

.paragraph.__3 {
  color: #ffc64a;
}

.paragraph.__4 {
  color: #5cc887;
}

.password-rules {
  padding: 0 0 1rem 0;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

.password-rules p.paragraph {
  margin-bottom: 0.5rem;
}

</style>
