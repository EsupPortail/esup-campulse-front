import { vi } from 'vitest'
import _axios from '@/plugins/axios'


vi.mock('@/plugins/axios', () => {
    return {
        default: { post: vi.fn(), get: vi.fn() }
    }
})
export const mockedAxios = vi.mocked(_axios, true)
