import {ref} from 'vue'
import type {PaginatedList, TargetPage} from '#/global'
import {useI18n} from 'vue-i18n'

const pagination = ref({
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

export const usePagination = function () {

    type ChangePageCb = () => Promise<void>

    async function changePage(targetPage: TargetPage, totalPages: number, cb: ChangePageCb) {
      let pageNumber: number = 1
      if (targetPage === 'last') pageNumber = totalPages ?? 1
      else if (targetPage === 'previous') pageNumber = pagination.value.page - 1
      else if (targetPage === 'next') pageNumber = pagination.value.page + 1
      pagination.value.page = pageNumber
      await cb()
    }

    // Object not typed by Quasar
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async function updateRowsPerPage(props: any, totalPages: number, cb: ChangePageCb) {
      const {rowsPerPage} = props.pagination
      pagination.value.rowsPerPage = rowsPerPage
      await changePage('first', totalPages, cb)
    }

    const listRange = <T>(list: PaginatedList<T> | undefined): string => {
      if (!list) return ''
      const {t} = useI18n()
      const start = list.range.start
      const end = list.range.end
      const count = list.count
      return t('pagination-range', {start, end, count})
    }

    return {
      pagination,
      updateRowsPerPage,
      changePage,
      listRange
    }
}