import {vi} from 'vitest'

export const axiosFixtures = {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn()
}