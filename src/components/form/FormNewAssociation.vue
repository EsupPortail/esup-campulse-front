<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted, reactive, ref, watch} from 'vue'
import axios from 'axios'
import useAssociation from '@/composables/useAssociation'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserStore} from '@/stores/useUserStore'
import useSecurity from '@/composables/useSecurity'
import type {NewAssociation} from '#/association'

const {t} = useI18n()
const {notify} = useQuasar()
const {createAssociation} = useAssociation()
const associationStore = useAssociationStore()
const userStore = useUserStore()
const {hasPerm} = useSecurity()


const newAssociation = reactive<NewAssociation>({
    name: '',
    institution: undefined,
    isSite: false
})

const institutions = ref<{ value: number, label: string }[]>([])

const initValues = () => {
    institutions.value = associationStore.institutions.map(function (institution) {
        return {
            value: institution.id,
            label: institution.name
        }
    })
    if (!hasPerm('add_association_any_institution')) {
        newAssociation.institution = userStore.user?.groups[0].institutionId
    }
}
watch(() => associationStore.institutions, initValues)

onMounted(async () => {
    await associationStore.getInstitutions()
})

async function onCreate() {
    try {
        await createAssociation(newAssociation)
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

const clearValues = () => {
    newAssociation.name = ''
    newAssociation.institution = undefined
    newAssociation.isSite = false
}

</script>

<template>
    <QForm
        class="q-gutter-md"
        @submit.prevent="onCreate"
        @reset-validation="clearValues"
    >
        <QInput
            v-model="newAssociation.name"
            :label="t('forms.association-name')"
            :rules="[ val => val.length > 0 || t('forms.fill-field') ]"
            filled
            lazy-rules
        />
        <QSelect
            v-model="newAssociation.institution"
            :label="t('forms.association-institution')"
            :options="institutions"
            :readonly="!hasPerm('add_association_any_institution')"
            :rules="[ val => val !== undefined || t('forms.select-option') ]"
            emit-value
            filled
            lazy-rules
            map-options
        />
        <QCheckbox
            v-model="newAssociation.isSite"
            :label="t('forms.association-is-site')"
        />
        <section class="btn-group">
            <QBtn
                :label="t('home.back-dashboard')"
                :to="{name: 'Dashboard'}"
                color="secondary"
                icon="mdi-arrow-left-circle"
            />
            <QBtn
                :label="t('user-manager.create-association')"
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
