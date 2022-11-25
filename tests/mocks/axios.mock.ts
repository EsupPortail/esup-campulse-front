import {vi} from 'vitest'
import _axios from '@/plugins/axios'

vi.mock('@/plugins/axios', () => {
    return {
        default: { post: vi.fn(), get: vi.fn(), patch: vi.fn() }
    }
})
export const mockedAxios = _axios


