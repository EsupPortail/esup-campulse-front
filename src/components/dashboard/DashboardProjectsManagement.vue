<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import useErrors from '@/composables/useErrors'
import axios from 'axios'
import {useProjectStore} from '@/stores/useProjectStore'
import type {ProjectList} from '#/project'
import useCommissions from '@/composables/useCommissions'
import type {SelectCommissionDateLabel} from '#/commissions'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {useUserStore} from '@/stores/useUserStore'
import TableManagedProjects from '@/components/table/TableManagedProjects.vue'
import useSecurity from '@/composables/useSecurity'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()
const {
    getCommissionDates,
    commissionDatesLabels,
    initCommissionDatesLabels,
    commissionDates,
    getCommissions
} = useCommissions()
const associationStore = useAssociationStore()
const userManagerStore = useUserManagerStore()
const userStore = useUserStore()
const {hasPerm} = useSecurity()


onMounted(async () => {
    loading.show()
    await onGetCommissionDates()
    initManagedCommissionDates()
    await onGetProjects(managedCommissionDates.value)
    await onGetApplicants()
    loading.hide()
})

const managedCommissionDates = ref<number[]>([])

const initManagedCommissionDates = () => {
    commissionDates.value.forEach((commissionDate) => {
        if (userStore.userCommissions?.includes(commissionDate.commission)) {
            managedCommissionDates.value.push(commissionDate.id)
        }
    })
}

const projects = ref<ProjectList[]>([])
watch(() => projectStore.projects, () => {
    projects.value = projectStore.projects
})

const commission = ref<SelectCommissionDateLabel>()
watch(() => commission.value, async () => {
    loading.show()
    if (commission.value?.value) {
        await onGetProjects([commission.value?.value])
    } else {
        await onGetProjects(managedCommissionDates.value)
    }
    loading.hide()
})

async function onGetCommissionDates() {
    try {
        await getCommissions()
        await getCommissionDates(false, true, true)
        initCommissionDatesLabels(undefined)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetProjects(commissionsDates: number[]) {
    try {
        await projectStore.getProjects(false, commissionsDates)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

async function onGetApplicants() {
    try {
        if (projectStore.projects.length) {
            if (projectStore.projects.find(obj => obj.association !== null)) {
                await associationStore.getAssociationNames(true, false)
            }
            if (projectStore.projects.find(obj => obj.user !== null)) {
                await userManagerStore.getUsers('validated')
            }
        }
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
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-folder2-open"
            ></i>
            {{ t('commission.applications') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <h3 class="section-title">
                    <i
                        aria-hidden="true"
                        class="bi bi-calendar-check"
                    ></i>
                    {{ t('commission.select-date') }}
                </h3>
                <QSelect
                    v-model="commission"
                    :label="t('commissions')"
                    :options="commissionDatesLabels"
                    clearable
                    filled
                />
                <TableManagedProjects :projects="projects"/>
            </div>
        </div>
    </section>
    <section
        v-if="hasPerm('change_commissiondate')"
        class="dashboard-section"
    >
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-calendar-check"
            ></i>
            {{ t('commission.dates') }}
        </h2>
        <div class="form-container">
            <div class="form">
                <div class="button-group">
                    <QBtn
                        :label="t('dashboard.manage-commission-dates')"
                        :to="{name: 'ManageCommissionDates'}"
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
</style>
