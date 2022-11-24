import { vi } from 'vitest'
import _axios from '@/plugins/axios'


vi.mock('@/plugins/axios', () => {
    return {
        default: { post: vi.fn(), get: vi.fn() }
    }
})
// export const mockedAxios = vi.mocked(_axios, true)
export const mockedAxios = vi.mocked<typeof _axios>(_axios, true) as typeof _axios

