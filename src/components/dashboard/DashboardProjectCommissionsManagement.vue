<script lang="ts" setup>
import TableManagedProjects from '@/components/table/TableManagedProjects.vue'
import useCommissions from '@/composables/useCommissions'
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
import {useProjectStore} from '@/stores/useProjectStore'

const {commissionDatesLabels} = useCommissions()
const {t} = useI18n()
const projectStore = useProjectStore()

const emit = defineEmits(['changeCommissionDate'])

const commission = ref<number>()

</script>

<template>
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
        emit-value
        filled
        map-options
        @update:model-value="emit('changeCommissionDate', commission)"
    />
    <TableManagedProjects :projects="projectStore.projects"/>
</template>