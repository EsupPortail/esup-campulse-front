import {ref} from 'vue'
import type {SearchCommissionFilters} from '#/commission'

const openCommissionSearch = ref<boolean>(false)

const commissionPaginationCurrent = ref<number>(1)

const searchCommissionFilters = ref<SearchCommissionFilters>({
  name: '',
  commissionDate: {from: null, to: null},
  submissionDate: {from: null, to: null},
  editionDate: {from: null, to: null},
  funds: []
})

function clearCommissionSearch(): void {
  searchCommissionFilters.value.name = ''
  searchCommissionFilters.value.commissionDate = {from: null, to: null}
  searchCommissionFilters.value.submissionDate = {from: null, to: null}
  searchCommissionFilters.value.editionDate = {from: null, to: null}
  searchCommissionFilters.value.funds = []
}

export default function useCommissionSearch() {
  return {
    openCommissionSearch,
    searchCommissionFilters,
    commissionPaginationCurrent,
    clearCommissionSearch
  }
}
