import type {Mocked} from 'vitest'
import {vi} from 'vitest'
import _axios from '@/plugins/axios'
import type {Axios} from "axios";

vi.mock('@/plugins/axios', () => {
    return {
        default: {
            post: vi.fn(),
            get: vi.fn(),
            patch: vi.fn(),
            delete: vi.fn()
        }
    }
})
export const mockedAxios: Mocked<Axios> = vi.mocked(_axios, true)


