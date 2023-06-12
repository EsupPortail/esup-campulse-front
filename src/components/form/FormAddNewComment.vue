<script lang="ts" setup>
import axios from 'axios'
import {QForm, useQuasar} from 'quasar'
import useProjectComments from '@/composables/useProjectComments'
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'

const {loading, notify} = useQuasar()
const {t} = useI18n()
const {postNewProjectComment, getProjectComments} = useProjectComments()
const {catchHTTPError} = useErrors()

const props = defineProps<{
    action: string
}>()

const newComment = ref<string>('')

const form = ref(QForm)

async function onPostNewComment() {
    loading.show()
    try {
        await postNewProjectComment(props.project, newComment.value)
        await getProjectComments(props.project)
        form.value.reset()
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
    <section>
        <h3 class="section-title">
            <i
                aria-hidden="true"
                class="bi bi-plus"
            ></i>
            {{ t('forms.add-new-comment') }}
        </h3>
    </section>
</template>