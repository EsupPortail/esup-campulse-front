<script lang="ts" setup>
import useProjectComment from '@/composables/useProjectComment'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useError'
import useUtil from '@/composables/useUtil'
import {useProjectStore} from '@/stores/useProjectStore'
import ProjectCommentForm from '@/components/project/projectDetail/ProjectCommentForm.vue'
import {usePermission} from '@/composables/usePermission'


const {t} = useI18n()
const {loading, notify} = useQuasar()
const {
  comments,
  getProjectComments,
  newComment,
  createProjectComment,
  updateProjectComment
} = useProjectComment()
const {catchHTTPError} = useErrors()
const {formatDate} = useUtil()
const {hasPerm} = usePermission()
const projectStore = useProjectStore()

const emit = defineEmits<{
  (_e: 'count-change', _count: number): void
}>()

const props = defineProps<{
  project: number | undefined
}>()

const open = ref<boolean>(false)

async function onGetProjectComments() {
  if (props.project) {
    try {
      await getProjectComments(props.project)
      emit('count-change', comments.value.length)
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
    emit('count-change', 0)
  }
}

onMounted(async () => {
  loading.show()
  await onGetProjectComments()
  loading.hide()
})

watch(() => props.project, async () => {
  await onGetProjectComments()
})

async function onPostNewComment() {
  if (projectStore.project && newComment.value) {
    loading.show()
    const projectId = projectStore.project.id
    try {
      await createProjectComment(projectId, newComment.value)
      await onGetProjectComments()
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

async function onUpdateProjectCommentVisibility(projectId: number, commentId: number) {
  loading.show()
  const comment = comments.value.find(obj => obj.id === commentId)
  if (comment) {
    const commentData = {
      id: comment.id,
      text: comment.text,
      isVisible: comment.isVisible
    }
    try {
      await updateProjectComment(projectId, commentData)
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
                  date: formatDate(comment.creationDate).split('-').reverse().join('/'),
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
          @update:model-value="onUpdateProjectCommentVisibility(comment.project, comment.id)"
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
        color="commission"
        icon="bi-plus-circle"
        @click="open = true"
      />
    </div>
  </div>

  <QDialog v-model="open">
    <QCard class="variant-space-3">
      <QCardSection class="q-pt-none">
        <ProjectCommentForm
          @submit="onPostNewComment"
          @close-dialog="open = false"
        />
      </QCardSection>
    </QCard>
  </QDialog>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms";
@import "@/assets/styles/dashboard";
@import "@/assets/variables";

.comment-row > div {
  align-items: flex-start;
}

.disabled-comment-row {
  border-color: $textColor2 !important;
}
</style>
