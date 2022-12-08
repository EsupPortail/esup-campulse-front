import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useDirectory from '@/composables/useDirectory'
import { useAssociationStore } from '@/stores/useAssociationStore'
import { config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

vi.mock('@/plugins/axios')

config.global.plugins = [
  createTestingPinia({ createSpy: vi.fn() }),
]

describe('useDirectory', () => {
  let associationStore = useAssociationStore()

  beforeEach(() => {
    associationStore = useAssociationStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Get association detail', () => {
    it('should call getAssociationDetail in store', async () => {
      const spy = vi.spyOn(associationStore, 'getAssociationDetail')
      const { getAssociationDetail } = useDirectory()

      await getAssociationDetail('1')

      expect(spy).toHaveBeenCalledOnce()
      expect(spy).toHaveBeenCalledWith(1)
    })
  })
})
