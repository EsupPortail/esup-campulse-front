import {vi} from 'vitest'

export const _axiosFixtures = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
}
