import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useUsers from '@/composables/useUsers'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'
import useUserGroups from '@/composables/useUserGroups'
import {_groups} from '~/fixtures/group.mock'
import {_institutionStudent} from '~/fixtures/user.mock'
import {useAxios} from '@/composables/useAxios'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useUsers', () => {
    let userManagerStore = useUserManagerStore()
    let userStore = useUserStore()

    beforeEach(() => {
        userManagerStore = useUserManagerStore()
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })


    describe('canEditUser', () => {
        const {groups} = useUserGroups()
        const {canEditUser} = useUsers()

        beforeEach(() => {
            groups.value = _groups
        })

        afterEach(() => {
            groups.value = []
        })

        it('should return true if the user is not a member of a private group', () => {
            const perm = canEditUser([{userId: 1, groupId: 6}])
            expect(perm).toBeTruthy()
        })

        it('should return false if the user is a member of a private group', () => {
            const perm = canEditUser([{userId: 2, groupId: 1}])
            expect(perm).toBeFalsy()
        })
    })

    describe('updateUserInfos', () => {
        const {updateUserInfos, infosToPatch} = useUsers()
        const {axiosAuthenticated} = useAxios()

        infosToPatch.username = 'username'
        infosToPatch.firstName = 'Jane'
        infosToPatch.lastName = 'Lennon'
        infosToPatch.email = 'jane@lennon.uk'
        infosToPatch.phone = '00'

        describe('if user is edited by staff', () => {
            beforeEach(() => {
                userManagerStore.user = _institutionStudent
                const mockedAxios = vi.mocked(axiosAuthenticated, true)
                mockedAxios.patch.mockResolvedValueOnce({data: _institutionStudent})
            })

            afterEach(() => {
                userManagerStore.user = undefined
            })

            it('should only patch changed infos on /users/userId', async () => {
                await updateUserInfos(userManagerStore.user, true)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, infosToPatch)
            })
        })

        describe('if user is not edited by staff', () => {
            beforeEach(() => {
                userStore.user = _institutionStudent
                const mockedAxios = vi.mocked(axiosAuthenticated, true)
                mockedAxios.patch.mockResolvedValueOnce({data: _institutionStudent})
            })

            afterEach(() => {
                userStore.user = undefined
            })

            it('should only patch changed infos on /users/auth/user', async () => {
                await updateUserInfos(userStore.user, false)
                expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
                expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/users/auth/user/', infosToPatch)
            })
        })

        it('should not patch anything if there are no changes', async () => {
            delete infosToPatch.username
            delete infosToPatch.firstName
            delete infosToPatch.lastName
            delete infosToPatch.email
            delete infosToPatch.phone

            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            mockedAxios.patch.mockResolvedValueOnce({data: _institutionStudent})

            await updateUserInfos(userManagerStore.user, true)
            expect(axiosAuthenticated.patch).toHaveBeenCalledTimes(0)
        })
    })
})
