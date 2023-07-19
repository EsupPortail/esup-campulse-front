<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useProjectComments from '@/composables/useProjectComments'

const {t} = useI18n()
const {newComment} = useProjectComments()

const emit = defineEmits(['closeDialog', 'submit'])

</script>

<template>
    <QForm
        @submit.prevent="emit('submit')"
    >
        <QInput
            v-model="newComment"
            :aria-required="true"
            :label="t('forms.comment')"
            :rules="[ val => val && val.length > 0 || t('forms.required-comment')]"
            color="commission"
            filled
            for="newComment"
            lazy-rules
            type="textarea"
        />
        <div class="flex-row-center padding-top comment-btn">
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="commission"
                icon="bi-box-arrow-left"
                @click="emit('closeDialog')"
            />
            <QBtn
                :label="t('project.new-comment')"
                class="btn-lg"
                color="commission"
                icon="bi-chat"
                type="submit"
            />
        </div>
    </QForm>
</template>

