<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {QForm, useQuasar} from 'quasar'
import {onMounted, reactive, ref, watch} from 'vue'
import axios from 'axios'
import useAssociation from '@/composables/useAssociation'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserStore} from '@/stores/useUserStore'
import type {NewAssociation} from '#/association'
import useSecurity from '@/composables/useSecurity'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify} = useQuasar()
const {createAssociation} = useAssociation()
const associationStore = useAssociationStore()
const userStore = useUserStore()
const {hasPerm} = useSecurity()
const {catchHTTPError} = useErrors()


const newAssociation = reactive<NewAssociation>({
    name: '',
    institution: undefined,
    isSite: false
})

const institutions = ref<({ value: number, label: string } | undefined)[]>([])
const newAssociationForm = ref(QForm)

const initValues = () => {
    institutions.value = []
    if (userStore.userInstitutions && userStore.userInstitutions?.length !== 0) {
        associationStore.institutions.forEach(function (institution) {
            if (userStore.userInstitutions?.includes(institution.id)) {
                institutions.value.push(
                    {
                        value: institution.id,
                        label: institution.name
                    }
                )
            }
        })
    }
}
watch(() => associationStore.institutions, initValues)
watch(() => userStore.userInstitutions, initValues)

onMounted(async () => {
    await associationStore.getInstitutions()
    initValues()
})

async function onCreate() {
    try {
        await createAssociation(newAssociation)
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-association')
        })
        if (newAssociationForm.value) {
            newAssociationForm.value.reset()
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.data.error === 'Association name already taken.') {
                notify({
                    type: 'negative',
                    message: t('notifications.negative.association-already-exists')
                })
            } else {
                notify({
                    type: 'negative',
                    message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
                })
            }
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
        ref="newAssociationForm"
        class="q-gutter-md"
        @reset="clearValues"
        @submit.prevent="onCreate"
    >
        <div class="form-title">
            <h2>
                <i class="bi bi-plus-square"></i>
                {{ t('dashboard.create-association') }}
            </h2>
        </div>
        <div class="form-container">
            <div class="form">
                <QInput
                    v-model="newAssociation.name"
                    :label="t('forms.association-name')"
                    :rules="[val => val.length > 0 || t('forms.fill-field')]"
                    filled
                    lazy-rules
                />
                <QSelect
                    v-model="newAssociation.institution"
                    :label="t('forms.association-institution')"
                    :options="institutions"
                    :rules="[val => val !== undefined || t('forms.select-option')]"
                    emit-value
                    filled
                    lazy-rules
                    map-options
                />
                <QCheckbox
                    v-if="hasPerm('add_association_all_fields')"
                    v-model="newAssociation.isSite"
                    :label="t('forms.association-is-site')"
                />
                <section class="btn-group">
                    <QBtn
                        :label="t('home.back-dashboard')"
                        :to="{ name: 'Dashboard' }"
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
            </div>
        </div>
    </QForm>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';

.q-card__section {
    padding: 1rem 0 0 0;
}

h2 {
    padding-left: 1rem;
}

@media screen and (min-width: $responsiveWidth) {
    .form {
        width: $halfSize;
        margin: auto;
    }

    .btn-group {
        justify-content: flex-start;
        margin: 1rem 0 0 0;
    }
}
</style>
