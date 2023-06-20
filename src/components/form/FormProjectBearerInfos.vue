<script lang="ts" setup>
import FormUserAddress from '@/components/form/FormUserAddress.vue'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/stores/useUserStore'
import useSubmitProject from '@/composables/useSubmitProject'

const {t} = useI18n()
const userStore = useUserStore()
const {projectBasicInfos, projectReview} = useSubmitProject()

const props = defineProps<{
    applicant: 'association' | 'user',
    process: 'project' | 'review'
}>()

</script>

<template>
    <fieldset v-if="props.applicant === 'association'">
        <legend class="title-3">{{ t('project.bearer-identity') }}</legend>
        <div
            v-if="props.process === 'review'"
            class="info-panel info-panel-warning"
        >
            <i
                aria-hidden="true"
                class="bi bi-exclamation-lg"
            ></i>
            <p>
                {{ t('project.review-bearer-info-panel') }}
            </p>
        </div>
        <fieldset>
            <legend class="self-bearer">{{ t('project.enter-bearer-infos') }} :</legend>
            <div v-if="props.process === 'project'">
                <QInput
                    v-model="projectBasicInfos.otherFirstName"
                    :label="t('project.other-first-name') + ' *'"
                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                    aria-required="true"
                    clearable
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="projectBasicInfos.otherLastName"
                    :label="t('project.other-last-name') + ' *'"
                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                    aria-required="true"
                    clearable
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="projectBasicInfos.otherEmail"
                    :label="t('project.other-email') + ' *'"
                    :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                    aria-required="true"
                    class="no-rules"
                    clearable
                    filled
                    lazy-rules
                />
            </div>
            <div v-else>
                <QInput
                    v-model="projectReview.otherFirstName"
                    :label="t('project.other-first-name') + ' *'"
                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                    aria-required="true"
                    clearable
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="projectReview.otherLastName"
                    :label="t('project.other-last-name') + ' *'"
                    :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                    aria-required="true"
                    clearable
                    filled
                    lazy-rules
                />
                <QInput
                    v-model="projectReview.otherEmail"
                    :label="t('project.other-email') + ' *'"
                    :rules="[(val, rules) => rules.email(val) || t('forms.required-email')]"
                    aria-required="true"
                    class="no-rules"
                    clearable
                    filled
                    lazy-rules
                />
            </div>
        </fieldset>
    </fieldset>
    <fieldset
        v-else
        class="individual-bearer"
    >
        <legend class="title-3">{{ t('address.address') }}</legend>
        <div class="info-panel info-panel-warning">
            <i
                aria-hidden="true"
                class="bi bi-info"
            ></i>
            <p>{{ t('address.verify') }}</p>
        </div>
        <FormUserAddress :user="userStore.user"/>
    </fieldset>
</template>