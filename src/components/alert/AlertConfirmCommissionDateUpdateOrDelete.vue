<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'

const props = defineProps<{
    commissionDate: number,
    datesAreLegal: boolean | undefined
}>()

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()

const confirmUpdate = ref<boolean>(false)
const confirmDelete = ref<boolean>(false)

async function onOpenDeleteAlert() {
    loading.show()
    try {
        await projectStore.getProjects(false, [props.commissionDate])
        confirmDelete.value = true
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
    <div class="flex-btn">
        <QBtn
            :disable="!props.datesAreLegal"
            :label="t('update')"
            icon="mdi-autorenew"
            @click="confirmUpdate = true"
        />
        <QDialog
            v-model="confirmUpdate"
            persistent
        >
            <QCard>
                <QCardSection class="row items-center">
                    <span class="q-ml-sm">{{ t('commission.alerts.confirm-update') }}</span>
                </QCardSection>

                <QCardActions align="right">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        icon="mdi-arrow-left-circle"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('update')"
                        icon="mdi-autorenew"
                        @click="$emit('updateCommissionDate')"
                    />
                </QCardActions>
            </QCard>
        </QDialog>
        <QBtn
            :label="t('delete')"
            icon="mdi-delete-outline"
            @click="onOpenDeleteAlert"
        />
        <QDialog
            v-model="confirmDelete"
            persistent
        >
            <QCard>
                <QCardSection class="row items-center">
                    <p class="paragraph">{{ t('commission.alerts.confirm-delete') }}</p>
                    <div
                        v-if="projectStore.projects.length"
                        class="info-panel info-panel-error"
                    >
                        <i
                            aria-hidden="true"
                            class="bi bi-exclamation-lg"
                        ></i>
                        <p class="paragraph">
                            {{ t('commission.alerts.delete-warning-projects-submitted') }}
                            <ul>
                                <li
                                    v-for="project in projectStore.projects"
                                    :key="project.id"
                                >
                                    {{ project.name }}
                                </li>
                            </ul>
                        </p>
                    </div>
                </QCardSection>

                <QCardActions align="right">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        icon="mdi-arrow-left-circle"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('delete')"
                        icon="mdi-delete-outline"
                        @click="$emit('deleteCommissionDate')"
                    />
                </QCardActions>
            </QCard>
        </QDialog>
    </div>
</template>