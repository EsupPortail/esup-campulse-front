import {createPinia, setActivePinia} from 'pinia'
import {defineComponent, nextTick, ref} from 'vue'
import {describe, expect, it, vi} from 'vitest'
import {mount} from '@vue/test-utils'
import type {ManagedCommission, UpdateCommission} from '#/commission'
import type {PaginatedList} from '#/global'
import CommissionDate from '@/components/commission/commissionDates/CommissionDate.vue'
import {useCommissionStore} from '@/stores/useCommissionStore'
import {_commissionFundData, _managedCommissions} from '~/fixtures/commission.mock'

vi.mock('vue-i18n', async importOriginal => ({
  ...await importOriginal<typeof import('vue-i18n')>(),
  useI18n: () => ({t: (key: string) => key})
}))
vi.mock('quasar', async importOriginal => ({
  ...await importOriginal<typeof import('quasar')>(),
  useQuasar: () => ({loading: {show: vi.fn(), hide: vi.fn()}, notify: vi.fn()})
}))
vi.mock('vue-router', async importOriginal => ({
  ...await importOriginal<typeof import('vue-router')>(),
  useRoute: () => ({name: 'ManageCommissionDates'}),
  useRouter: () => ({push: vi.fn()})
}))
vi.mock('@/services/CommissionService', () => ({
  createCommission: vi.fn(),
  createCommissionFund: vi.fn(),
  deleteCommissionFund: vi.fn(),
  getCommissions: vi.fn(),
  getManagedCommissions: vi.fn(),
  getCommissionFunds: vi.fn(),
  getFunds: vi.fn(),
  deleteCommission: vi.fn(),
  updateCommission: vi.fn()
}))

setActivePinia(createPinia())

const original: ManagedCommission = {
  ...structuredClone(_managedCommissions[1]),
  editionDate: '2099-10-09',
  scheduledTime: '09:00:00',
  building: '',
  room: '',
  address: '',
  funds: [_commissionFundData[0], _commissionFundData[1]]
}

const editable: UpdateCommission = {
  id: original.id,
  name: original.name,
  commissionDate: original.commissionDate,
  submissionDate: original.submissionDate,
  editionDate: original.editionDate,
  isOpenToProjects: original.isOpenToProjects,
  scheduledTime: '09:00',
  building: '',
  room: '',
  address: '',
  funds: [1, 2],
  datesAreLegal: false,
  editionDateIsLegal: false,
  open: true
}

describe('CommissionDate', () => {
  it('enables the update button when an optional field changes', async () => {
    const commissions: PaginatedList<ManagedCommission> = {
      count: 1,
      totalPages: 1,
      currentPage: 1,
      range: {start: 1, end: 1},
      next: null,
      previous: null,
      results: [original]
    }
    useCommissionStore().commissions = commissions

    const Wrapper = defineComponent({
      components: {CommissionDate},
      template: '<CommissionDate v-model="commission" :original-commission="original" />',
      setup() {
        return {
          commission: ref<UpdateCommission>({...editable}),
          original
        }
      }
    })
    const wrapper = mount(Wrapper, {
      global: {
        stubs: {
          QForm: {template: '<div><slot /></div>'},
          QInput: true,
          QSelect: true,
          QToggle: true,
          QBtn: true,
          QDialog: true,
          QCard: true,
          QCardSection: true,
          AlertConfirmCommissionDateUpdateOrDelete: {
            name: 'AlertConfirmCommissionDateUpdateOrDelete',
            props: ['canUpdate', 'commissionId'],
            template: '<div class="update-action" :data-can-update="canUpdate" />'
          }
        }
      }
    })

    expect(wrapper.find('.update-action').attributes('data-can-update')).toBe('false')
    expect(wrapper.find('h4').text()).toBe(original.name)

    wrapper.vm.commission.building = 'Esplanade'
    wrapper.vm.commission.name = 'Nom modifié'
    await nextTick()

    expect(wrapper.find('.update-action').attributes('data-can-update')).toBe('true')
    expect(wrapper.find('h4').text()).toBe(original.name)
  })
})
