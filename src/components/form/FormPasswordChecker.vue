<script lang="ts" setup>
import type {PasswordChecker} from '#/index'
import {useI18n} from 'vue-i18n'
import {ref, watch} from 'vue'

const props = defineProps<{
    passwordChecker: PasswordChecker,
    password: string | null
}>()

const {t} = useI18n()

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
                aria-hidden="true"
            >
            </div>
        </div>
        <div
            aria-live="polite"
            aria-describedby="new-password-to-check"
        >
            <p :class="`paragraph __${props.passwordChecker.score}`">
                {{ resultLabels.find(label => label.score === props.passwordChecker.score)?.label }}
            </p>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";

.form-state {
  display: flex;
  flex-direction: row;

  i {
    width: 1.5rem;
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
  background-color: $stateColorPassword0;
}

.password-feedback-bar > .__1 {
  background-color: $stateColorPassword1;
}

.password-feedback-bar > .__2 {
  background-color: $stateColorPassword2;
}

.password-feedback-bar > .__3 {
  background-color: $stateColorPassword3;
}

.password-feedback-bar > .__4 {
  background-color: $stateColorPassword4;
}

.paragraph.__0 {
  color: $stateColorPassword0;
}

.paragraph.__1 {
  color: $stateColorPassword1;
}

.paragraph.__2 {
  color: $stateColorPassword2;
}

.paragraph.__3 {
  color: $stateColorPassword3;
}

.paragraph.__4 {
  color: $stateColorPassword4;
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
