<script lang="ts" setup>
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import useAssociation from '@/composables/useAssociation'
import {onMounted, ref} from 'vue'
import {useUserStore} from '@/stores/useUserStore'

const {getAssociationPdfExport} = useAssociation()
const route = useRoute()
const {loading, notify} = useQuasar()
const {t} = useI18n()
const {catchHTTPError} = useErrors()

const associationId = ref<number>()
const associationName = ref<string>('')
const userStore = useUserStore()


const initAssociation = () => {
    associationId.value = parseInt(route.params.associationId as string)
    associationName.value = userStore.userAssociations.find(obj => obj.association.id === associationId.value)?.association.name ?? ''
}

onMounted(initAssociation)

async function onGetAssociationPdfExport() {
    if (associationId.value && associationName.value) {
        loading.show()
        try {
            const file = await getAssociationPdfExport(associationId.value)
            const link = document.createElement('a')
            link.href = window.URL.createObjectURL(new Blob([file]))
            link.download = `${t('charter.pdf-name')}${encodeURI(associationName.value)}.pdf`
            document.body.appendChild(link)
            link.click()
            link.remove()
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
}
</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <section class="recap">
                    <i
                        aria-hidden="true"
                        class="bi bi-check-circle"
                    ></i>
                    <h2>{{ t('charter.site.sign-form.recap.title') }}</h2>
                    <p class="paragraph">{{ t('charter.site.sign-form.recap.description') }}</p>
                    <div class="flex-row-center">
                        <QBtn
                            :label="t('project.download-recap')"
                            class="btn-lg"
                            color="charter"
                            icon-right="bi-filetype-pdf"
                            text-color="charter"
                            @click="onGetAssociationPdfExport"
                        />
                        <QBtn
                            :label="t('dashboard.charter-dashboard')"
                            :to="{name: 'Charter'}"
                            class="btn-lg"
                            color="charter"
                            icon-right="bi-chevron-compact-right"
                            text-color="charter"
                        />
                    </div>
                </section>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/_variables.scss';

i {
    color: $charteColor;
    font-size: 5rem;
}

.recap {
    text-align: center;
    padding: 3rem 0 3rem 0;
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
}
</style>
