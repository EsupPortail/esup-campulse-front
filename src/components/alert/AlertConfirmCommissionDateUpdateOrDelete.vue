<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'
import type {UpdateCommission} from '#/commissions'
import useUtility from '@/composables/useUtility'
import useCommissions from '@/composables/useCommissions'

const props = defineProps<{
    commission: UpdateCommission
}>()

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {arraysAreEqual} = useUtility()
const {commissionFunds} = useCommissions()

const confirmUpdate = ref<boolean>(false)
const confirmDelete = ref<boolean>(false)

async function onOpenDeleteAlert() {
    loading.show()
    try {
        const commissionFundsArray = commissionFunds.value.filter(obj => obj.commission === props.commission.id).map(x => x.id)
        await projectStore.getProjects(false, commissionFundsArray)
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
    <div class="flex-btn variant-space-3">
        <QBtn
            :disable="!commission.datesAreLegal && commission.newName === commission.oldName
                && commission.newCommissionDate === commission.oldCommissionDate
                && commission.newSubmissionDate === commission.oldSubmissionDate
                && commission.newIsOpenToProjects === commission.oldIsOpenToProjects
                && arraysAreEqual(commission.oldFunds, commission.newFunds)"
            :label="t('update')"
            icon="bi-arrow-repeat"
            @click="confirmUpdate = true"
        />
        <QDialog
            v-model="confirmUpdate"
            persistent
        >
            <QCard>
                <QCardSection class="row items-center">
                    <p class="paragraph">{{ t('commission.alerts.confirm-update') }}</p>
                </QCardSection>

                <QCardActions align="right">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        icon="bi-x-lg"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('update')"
                        icon="bi-arrow-repeat"
                        @click="$emit('updateCommissionDate')"
                    />
                </QCardActions>
            </QCard>
        </QDialog>
        <QBtn
            :label="t('delete')"
            icon="bi-trash"
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
                        icon="bi-x-lg"
                    />
                    <QBtn
                        v-close-popup
                        :label="t('delete')"
                        icon="bi-trash"
                        @click="$emit('deleteCommissionDate')"
                    />
                </QCardActions>
            </QCard>
        </QDialog>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";

.q-card {
    padding: 1rem
}
</style>