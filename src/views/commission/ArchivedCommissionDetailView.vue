<script lang="ts" setup>
import {useRoute} from 'vue-router'
import TableManagedProjects from '@/components/table/TableManagedProjects.vue'
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import useCommissions from '@/composables/useCommissions'
import useUtility from '@/composables/useUtility'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const {getCommission, commission} = useCommissions()
const {dynamicTitle} = useUtility()
const route = useRoute()

const commissionId = ref<number>(parseInt(route.params.id as string))

onMounted(async () => {
    loading.show()
    await onGetCommission()
    loading.hide()
})

async function onGetCommission() {
    try {
        await getCommission(commissionId.value)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}

const initDynamicTitle = () => {
    dynamicTitle.value = commission.value?.name
}
watch(() => commission.value, initDynamicTitle)

</script>


<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <TableManagedProjects
                    :commission="commissionId"
                    :title="t('project.archived-projects')"
                    project-status="all"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';

.form {
    width: 80% !important;
}
</style>