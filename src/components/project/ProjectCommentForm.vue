<script lang="ts" setup>
import useProjectComments from '@/composables/useProjectComments'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {onMounted, ref} from 'vue'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useRoute} from 'vue-router'
import useUtility from '@/composables/useUtility'


const {t} = useI18n()
const {loading, notify} = useQuasar()
const {comments, getProjectComments, postNewProjectComment} = useProjectComments()
const {catchHTTPError} = useErrors()
const route = useRoute()
const {formatDate} = useUtility()

onMounted(async () => {
    loading.show()
    project.value = parseInt(route.params.projectId as string)
    await onGetProjectComments()
    loading.hide()
})

const project = ref<number>()

const newComment = ref<string>('')

async function onGetProjectComments() {
    try {
        await getProjectComments(project.value as number)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onPostNewComment() {
    loading.show()
    try {
        await postNewProjectComment(project.value as number, newComment.value)
        await onGetProjectComments()
        notify({
            type: 'positive',
            message: t('notifications.positive.new-project-comment')
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
    <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-row"
    >
        <p class="comment-head">
            <i
                aria-hidden="true"
                class="bi bi-chat"
            ></i>
            {{ t('project.comments.comment-from') }} <span class="value">{{ comment.user }}</span>
            {{ t('project.comments.on-date') }} <span class="value">{{
                formatDate(comment.creationDate).split('-').reverse().join('/')
            }}</span>
        </p>
        <p>
            {{ comment.text }}
        </p>
    </div>
    <div v-if="!comments.length">
        <p class="paragraph">{{ t('project.comments.no-comment-to-show') }}</p>
    </div>
    <QForm
        @reset="onReset"
        @submit.prevent="onPostNewComment"
    >
        <QInput
            v-model="newComment"
            :label="t('project.comments.new-comment') + ' *'"
            :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
            filled
            lazy-rules
            type="textarea"
        />
        <div>
            <QBtn
                :label="t('validate')"
                icon="bi-check-lg"
                type="submit"
            />
        </div>
    </QForm>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

.comment-row, .q-form {
    width: 80% !important;
}

.q-form {
    margin: auto;
    padding: 1rem 0;
}

.paragraph {
    margin: auto;
    width: 80%;
}

.flex-section {
    display: flex;
    flex-direction: column;
    gap: 1rem
}
</style>