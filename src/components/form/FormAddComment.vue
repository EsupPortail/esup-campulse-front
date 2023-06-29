<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useProjectComments from '@/composables/useProjectComments'

const {t} = useI18n()
const {newComment} = useProjectComments()

type Action = 'validate' | 'reject' | 'return' | 'new-comment' | ''
type Icon = 'bi-check-lg' | 'bi-x-octagon' | 'bi-exclamation-triangle' | 'bi-chat' | ''

const props = defineProps<{
    selectedAction: Action,
    selectedIcon: Icon
}>()

const emit = defineEmits(['submit', 'closeDialog'])

</script>

<template>
    <QForm
        @submit.prevent="emit('submit')"
    >
        <h3 class="title-3">{{ t('project.new-comment') }}</h3>
        <QInput
            v-model="newComment"
            :aria-required="props.selectedAction !== 'validate'"
            :hint="props.selectedAction !== 'new-comment' ? t('forms.comment-hint') : ''"
            :label="t('forms.comment') + (props.selectedAction !== 'validate' ? ` (${t('required')})` : ` (${t('optional')})`)"
            :rules="props.selectedAction !== 'validate' ? [ val => val && val.length > 0 || t('forms.fill-field')] : []"
            filled
            lazy-rules
            type="textarea"
        />
        <div class="btn-group">
            <QBtn
                :label="t('back')"
                icon="bi-box-arrow-left"
                @click="emit('closeDialog')"
            />
            <QBtn
                :icon="props.selectedIcon"
                :label="t(`project.${props.selectedAction}`)"
                type="submit"
            />
        </div>
    </QForm>
</template>
