<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import useCharters from '@/composables/useCharters'
import type {QTableProps} from 'quasar'


const {t} = useI18n()
const {associationCharters} = useCharters()


const columns: QTableProps['columns'] = [
    {name: 'association', align: 'left', label: t('association.association'), field: 'association', sortable: true},
    {
        name: 'institution',
        align: 'left',
        label: t('association.labels.institution'),
        field: 'institution',
        sortable: true
    },
    {
        name: 'charterStatus',
        align: 'left',
        label: t('charter.charter', 2),
        field: 'charterStatus',
        sortable: false
    },
    {name: 'actions', align: 'center', label: t('manage'), field: 'actions', sortable: false}
]
</script>

<template>
    <QTable
        :columns="columns"
        :rows="associationCharters"
        :rows-per-page-options="[10, 20, 50, 0]"
        role="presentation"
        row-key="name"
    >
        <template v-slot:header="props">
            <QTr :props="props">
                <QTh
                    v-for="col in props.cols"
                    :id="col.name"
                    :key="col.name"
                    :props="props"
                    scope="col"
                >
                    {{ col.label }}
                </QTh>
            </QTr>
        </template>
        <template v-slot:body="props">
            <QTr :props="props">
                <QTd
                    key="association"
                    :props="props"
                    headers="association"
                >
                    {{ props.row.associationName }}
                </QTd>
                <QTd
                    key="institution"
                    :props="props"
                    headers="institution"
                >
                    {{ props.row.institution }}
                </QTd>
                <QTd
                    key="charterStatus"
                    :props="props"
                    headers="charterStatus"
                >
                    <QExpansionItem
                        :label="t('charter.view-charter', 2)"
                        expand-separator
                        header-class="text-charter"
                    >
                        <QCard>
                            <QCardSection>
                                <ul>
                                    <li
                                        v-for="charter in props.row.charters"
                                        :key="charter.charterId"
                                    >
                                        {{ charter.charterName }}
                                        <span class="form-state form-state-charter">
                                            <span
                                                v-if="charter.charterStatus === 'NO_CHARTER'"
                                                :aria-label="t('charter.status.no-charter')"
                                                class="form-state-icon form-state-grey"
                                            ><i class="bi bi-dash"></i></span>
                                            <span
                                                v-if="charter.charterStatus === 'EXPIRED'"
                                                :aria-label="t('charter.status.expired')"
                                                class="form-state-icon form-state-red"
                                            ><i class="bi bi-x"></i></span>
                                            <span
                                                v-if="charter.charterStatus === 'VALIDATED'"
                                                :aria-label="t('charter.status.validated')"
                                                class="form-state-icon form-state-green"
                                            ><i class="bi bi-check"></i></span>
                                            <span
                                                v-if="charter.charterStatus === 'PROCESSING'"
                                                :aria-label="t('charter.status.processing')"
                                                class="form-state-icon form-state-orange"
                                            ><i class="bi bi-dash"></i></span>
                                        </span>
                                    </li>
                                </ul>
                            </QCardSection>
                        </QCard>
                    </QExpansionItem>
                </QTd>
                <QTd
                    key="actions"
                    :props="props"
                    headers="actions"
                >
                    <QBtn
                        :label="t('manage')"
                        :to="{name: 'AssociationChartersDetail', params: {associationId: props.row.associationId}}"
                        color="charter"
                        outline
                    />
                </QTd>
            </QTr>
        </template>
        <template v-slot:pagination="scope">
            {{
                t('table.results-amount', {
                    firstResult: scope.pagination.rowsPerPage * (scope.pagination.page - 1) + 1,
                    lastResult: scope.pagination.rowsPerPage * scope.pagination.page,
                    amountResults: scope.pagination.rowsPerPage * scope.pagesNumber
                })
            }}
            <QBtn
                v-if="scope.pagesNumber > 2"
                :aria-label="t('table.first-page')"
                :disable="scope.isFirstPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-double-left"
                @click="scope.firstPage"
            />
            <QBtn
                :aria-label="t('table.previous-page')"
                :disable="scope.isFirstPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-left"
                @click="scope.prevPage"
            />
            <QBtn
                :aria-label="t('table.next-page')"
                :disable="scope.isLastPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-right"
                @click="scope.nextPage"
            />
            <QBtn
                v-if="scope.pagesNumber > 2"
                :aria-label="t('table.last-page')"
                :disable="scope.isLastPage"
                color="grey-8"
                dense
                flat
                icon="bi-chevron-double-right"
                @click="scope.lastPage"
            />
        </template>
    </QTable>
</template>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";

ul {
    padding-left: 0;
}

ul li {
    list-style: none;
    text-align: right;
}
</style>