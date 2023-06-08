<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref, watch} from 'vue'
import axios from 'axios'
import {QForm, useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import useProjectComments from '@/composables/useProjectComments'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const {catchHTTPError} = useErrors()
const {comments, patchProjectComment, deleteProjectComment} = useProjectComments()

const props = defineProps<{
    commentId: number,
    commentText: string,
    projectId: number
}>()

const open = ref<boolean>(false)

const modifiedComment = ref<string | undefined>('')

const form = ref(QForm)

const action = ref<'modify' | 'delete' | undefined>(undefined)
watch(() => action.value, async () => {
    if (action.value === 'modify') {
        modifiedComment.value = props.commentText
    }
})

async function onModifyComment() {
    loading.show()
    try {
        if (modifiedComment.value && modifiedComment.value !== props.commentText) {
            await patchProjectComment(modifiedComment.value, props.projectId, props.commentId)
            form.value.reset()
            open.value = false
            notify({
                type: 'positive',
                message: t('notifications.positive.comment-modified')
            })
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}

async function onDeleteComment() {
    loading.show()
    try {
        await deleteProjectComment(props.projectId, props.commentId)
        comments.value.splice(comments.value.findIndex(obj => obj.id === props.commentId), 1)
        open.value = false
        notify({
            type: 'positive',
            message: t('notifications.positive.comment-deleted')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}
</script>

<template>
    <div class="comment-edition-btn">
        <QBtn
                :aria-label="t('modify')"
                icon="bi-pencil"
                @click="open = true; action = 'modify'"
        />
        <QBtn
                :aria-label="t('delete')"
                icon="bi-trash"
                @click="open = true; action = 'delete'"
        />
    </div>
    <QDialog
            v-model="open"
            class="variant-space-3"
    >
        <QCard>
            <QCardSection>
                <QForm
                        v-if="action === 'modify'"
                        ref="form"
                        class="q-gutter-md"
                        @reset="modifiedComment = ''"
                        @submit="onModifyComment"
                >
                    <h2 class="title-2">{{ t('forms.modify-comment') }}</h2>
                    <QInput
                            v-model="modifiedComment"
                            :label="t('forms.comment')"
                            :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                            filled
                            lazy-rules
                            type="textarea"
                    />
                    <div class="btn-group">
                        <QBtn
                                :label="t('cancel')"
                                icon="bi-x-lg"
                                @click="open = false"
                        />
                        <QBtn
                                :disable="modifiedComment === commentText"
                                :label="t('validate')"
                                icon="bi-check-lg"
                                type="submit"
                        />
                    </div>
                </QForm>
                <QForm
                        v-if="action === 'delete'"
                        class="q-gutter-md"
                        @submit="onDeleteComment"
                >
                    <h2 class="title-2">{{ t('forms.delete-comment') }}</h2>

                    <p class="paragraph">{{ t('forms.delete-comment-validation') }}</p>

                    <p class="paragraph comment-text">{{ props.commentText }}</p>

                    <div class="btn-group">
                        <QBtn
                                :label="t('cancel')"
                                icon="bi-x-lg"
                                @click="open = false"
                        />
                        <QBtn
                                :label="t('delete')"
                                icon="bi-trash"
                                type="submit"
                        />
                    </div>
                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import "@/assets/_variables.scss";

.comment-edition-btn {
  display: flex;
  gap: 0.2rem;

  ::v-deep(.q-btn) {
    background-color: transparent;
    box-shadow: none;

    .q-btn__content > * {
      color: $textColor2;
    }

    &:hover {
      box-shadow: 0 -0.25rem 0 0 $capeColor inset;
      background-color: transparent;

      .q-btn__content * {
        color: $textColor1;
      }
    }
  }
}

.comment-text {
  color: $textColor2
}
</style>