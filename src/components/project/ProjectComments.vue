<script lang="ts" setup>
import useProjectComments from '@/composables/useProjectComments'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {onMounted} from 'vue'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import useUtility from '@/composables/useUtility'


const {t} = useI18n()
const {loading, notify} = useQuasar()
const {comments, getProjectComments} = useProjectComments()
const {catchHTTPError} = useErrors()
const {formatDate} = useUtility()

const props = defineProps<{
    project: number
}>()

onMounted(async () => {
    loading.show()
    await onGetProjectComments()
    loading.hide()
})


async function onGetProjectComments() {
    try {
        await getProjectComments(props.project)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-row"
    >
        <p class="comment-head">
            <span>
                <i
                    aria-hidden="true"
                    class="bi bi-chat"
                ></i>
                {{ t('project.comments.comment-from') }} <span class="value">{{ comment.user.firstName + ' ' + comment.user.lastName }}</span>
                {{ t('project.comments.on-date') }} <span class="value">{{
                    formatDate(comment.creationDate).split('-').reverse().join('/')
                }}</span>
            </span>
        </p>
        <p>
            {{ comment.text }}
        </p>
    </div>
    <div v-if="!comments.length">
        <p class="paragraph">{{ t('project.comments.no-comment-to-show') }}</p>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
@import "@/assets/_variables.scss";

.comment-row {
    width: 100% !important;
}

.comment-head {
    display: flex;
    justify-content: space-between;
}

.paragraph {
    margin: auto;
    width: 80%;
}
</style>