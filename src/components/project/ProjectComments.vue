<script lang="ts" setup>
import useProjectComments from '@/composables/useProjectComments'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import useUtility from '@/composables/useUtility'
import useSecurity from '@/composables/useSecurity'
import {useProjectStore} from '@/stores/useProjectStore'
import FormAddComment from '@/components/form/FormAddComment.vue'


const {t} = useI18n()
const {loading, notify} = useQuasar()
const {
    comments,
    getProjectComments,
    newComment,
    postNewProjectComment,
    patchProjectComment
} = useProjectComments()
const {catchHTTPError} = useErrors()
const {formatDate} = useUtility()
const {hasPerm} = useSecurity()
const projectStore = useProjectStore()

const props = defineProps<{
    project: number | undefined
}>()

const open = ref<boolean>(false)

onMounted(async () => {
    loading.show()
    await onGetProjectComments()
    loading.hide()
})


async function onGetProjectComments() {
    if (props.project) {
        try {
            await getProjectComments(props.project)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
    } else {
        comments.value = []
    }
}

async function onPostNewComment() {
    if (projectStore.project && newComment.value) {
        loading.show()
        const projectId = projectStore.project.id
        try {
            await postNewProjectComment(projectId, newComment.value)
            await getProjectComments(projectId)
            open.value = false
            newComment.value = {
                text: '',
                isVisible: false
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
        loading.hide()
    }
}

async function onPatchProjectCommentVisibility(projectId: number, commentId: number) {
    loading.show()
    const comment = comments.value.find(obj => obj.id === commentId)
    if (comment) {
        const commentData = {
            id: comment.id,
            text: comment.text,
            isVisible: comment.isVisible
        }
        try {
            await patchProjectComment(projectId, commentData)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
    }
    loading.hide()
}
</script>

<template>
    <div class="flex-column">
        <div
            v-for="comment in comments"
            :key="comment.id"
            :class="(!comment.isVisible ? 'disabled-comment-row' : '') + ' comment-row'"
        >
            <div class="flex-row-space-between">
                <div>
                    <p class="comment-head">
                        <i
                            aria-hidden="true"
                            class="bi bi-chat"
                        ></i>
                        {{
                            t('project.comments.comment-metadata',
                              {
                                  user: comment.user.firstName + ' ' + comment.user.lastName,
                                  date: formatDate(comment.creationDate)?.split('-').reverse().join('/'),
                                  hour: new Date(comment.creationDate).getHours(),
                                  minutes: new Date(comment.creationDate).getMinutes() < 10 ? '0' + new
                                      Date(comment.creationDate).getMinutes() : new Date(comment.creationDate).getMinutes()
                              })
                        }}
                    </p>
                    <p>
                        {{ comment.text }}
                    </p>
                </div>
                <QToggle
                    v-if="hasPerm('change_projectcomment')"
                    v-model="comment.isVisible"
                    :aria-label="t('forms.comment-visibility')"
                    :icon="comment.isVisible ? 'bi-eye' : 'bi-eye-slash'"
                    color="commission"
                    size="lg"
                    @update:model-value="onPatchProjectCommentVisibility(comment.project, comment.id)"
                />
            </div>
        </div>
        <div v-if="!comments.length">
            <p>{{ t('project.comments.no-comment-to-show') }}</p>
        </div>
        <div>
            <QBtn
                v-if="hasPerm('add_projectcomment')"
                :label="t('project.new-comment')"
                class="btn-lg"
                color="commission"
                icon="bi-plus-circle"
                @click="open = true"
            />
        </div>
    </div>

    <QDialog v-model="open">
        <QCard class="variant-space-3">
            <QCardSection class="q-pt-none">
                <FormAddComment
                    @submit="onPostNewComment"
                    @close-dialog="open = false"
                />
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import "@/assets/_variables.scss";

.comment-row > div {
    align-items: flex-start;
}

.disabled-comment-row {
    border-color: $textColor2 !important;
}
</style>
