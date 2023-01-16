<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {ref} from 'vue'
import axios from 'axios'
import useAssociation from '@/composables/useAssociation'

const {t} = useI18n()
const {notify} = useQuasar()
const {createAssociation} = useAssociation()


const newAssociation = ref<string>('')

async function onCreate() {
    try {
        await createAssociation(newAssociation.value)
        newAssociation.value = ''
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-association')
        })
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data.error === 'Association name already taken.') {
            notify({
                type: 'negative',
                message: t('notifications.negative.association-already-exists')
            })
        } else {
            notify({
                type: 'negative',
                message: t('notifications.negative.error-new-association')
            })
        }
    }
}
</script>

<template>
    <QForm
        class="q-gutter-md"
        @submit.prevent="onCreate"
    >
        <QInput
            v-model="newAssociation"
            :label="t('forms.association-name')"
            filled
            lazy-rules
        />
        <section class="btn-group">
            <QBtn
                :label="t('home.back-dashboard')"
                :to="{name: 'Dashboard'}"
                color="secondary"
                icon="mdi-arrow-left-circle"
            />
            <QBtn
                :label="t('validate')"
                color="primary"
                icon="mdi-check-circle"
                type="submit"
            />
        </section>
    </QForm>
</template>

<style lang="sass" scoped>
.btn-group
    display: flex
    gap: 10px
</style>