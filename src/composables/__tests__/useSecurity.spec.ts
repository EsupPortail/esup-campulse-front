import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {createTestingPinia} from '@pinia/testing'
import {useUserStore} from '@/stores/useUserStore'
import useSecurity from '@/composables/useSecurity'


config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

describe('useSecurity', () => {
    let userStore = useUserStore()

    beforeEach(() => {
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })
    describe('logIn', () => {
        const {logIn, user} = useSecurity()
        it('should call logIn function in userStore with API route and user infos as payload', async () => {
            const spy = vi.spyOn(userStore, 'logIn')
            user.value.username = 'john'
            user.value.password = 'password'
            await logIn()
            expect(spy).toHaveBeenCalledOnce()
            expect(spy).toHaveBeenCalledWith('/users/auth/login/', user.value)
        })
    })
})