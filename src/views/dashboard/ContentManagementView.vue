<script lang="ts" setup>
import {useContentStore} from '@/stores/useContentStore'
import {onMounted, ref, watch} from 'vue'
import type {QTableProps} from 'quasar'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'
import type {Content} from '#/index'
import useErrors from '@/composables/useErrors'
import axios from 'axios'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const contentStore = useContentStore()
const {catchHTTPError} = useErrors()

const contents = ref<Content[]>([])

watch(() => contentStore.contents, () => {
    contents.value = contentStore.contents
})

onMounted(async () => {
    loading.show()
    await onGetContents()
    loading.hide()
})

async function onGetContents() {
    try {
        await contentStore.getContents(true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

const columns: QTableProps['columns'] = [
    {name: 'label', align: 'left', label: t('forms.label'), field: 'label', sortable: true},
    {
        name: 'edition',
        align: 'left',
        label: t('consult'),
        field: 'edition',
        sortable: false
    }
]

</script>

<template>
    <section class="dashboard-section">
        <h2>
            <i
                aria-hidden="true"
                class="bi bi-pencil-square"
            ></i>
            {{ t('dashboard.manage-contents') }}
        </h2>

        <div class="dashboard-section-container">
            <div class="container-lg">
                <QTable
                    :columns="columns"
                    :loading="!contents"
                    :rows="contents"
                    :rows-per-page-options="[10, 20, 50, 0]"
                    :title="t('dashboard.contents')"
                    role="presentation"
                    row-key="id"
                    wrap-cells
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
                                key="label"
                                :props="props"
                                headers="label"
                            >
                                {{ props.row.label }}
                            </QTd>
                            <QTd
                                key="edition"
                                :props="props"
                                class="actions-cell-compact"
                                headers="edition"
                            >
                                <div class="dashboard-btn-group">
                                    <QBtn
                                        :aria-label="t('modify')"
                                        :to="{ name: 'ContentManagementDetail', params: { id: props.row.id } }"
                                        color="dashboard"
                                        icon="bi-pencil"
                                        outline
                                    />
                                </div>
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
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/dashboard.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/variables.scss';

ul {
    padding-left: 0;
}

ul > li {
    list-style: none;
}
</style>
