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
        <h3>{{ t('project.new-comment') }}</h3>
        <QInput
            v-model="newComment"
            :aria-required="props.selectedAction !== 'validate'"
            :label="t('forms.comment') + (props.selectedAction !== 'validate' ? ` (${t('required')})` : ` (${t('optional')})`)"
            :rules="props.selectedAction !== 'validate' ? [ val => val && val.length > 0 || t('forms.required-comment')] : []"
            color="commission"
            filled
            lazy-rules
            type="textarea"
            bottom-slots
            for="newComment"
        >
            <template v-slot:hint>
                <p aria-describedby="newComment">{{ props.selectedAction !== 'new-comment' ? t('forms.project-comment-hint') : '' }}</p>
            </template>
        </QInput>
        <div class="flex-row-center padding-top comment-btn">
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                icon="bi-box-arrow-left"
                @click="emit('closeDialog')"
            />
            <QBtn
                :color="props.selectedAction === 'reject' || props.selectedAction === 'return' ? 'custom-red' : 'commission'"
                :icon="props.selectedIcon"
                :label="t(`project.${props.selectedAction}`)"
                class="btn-lg"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
.comment-btn {
    margin-top: 3rem;
}
</style>
