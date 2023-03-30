import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useUsers from '@/composables/useUsers'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'

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


    /*describe('canEditUser', () => {
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
    })*/

    /*describe('updateUserInfos', () => {
        const {updateUserInfos, userToUpdate} = useUsers()

        it('should only patch changed infos on /users/userId', async () => {
            userManagerStore.user = _institutionStudent
            userToUpdate.value = {
                username: _institutionStudent.username,
                firstName: 'Jane',
                lastName: _institutionStudent.lastName,
                email: 'jane@lennon.uk',
                newEmail: '',
                newEmailVerification: '',
                phone: _institutionStudent.phone
            }
            await updateUserInfos(userManagerStore.user, true)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(`/users/${userManagerStore.user?.id}`, {
                firstName: 'Jane',
                email: 'jane@lennon.uk'
            })
        })
        it('should not patch anything if there are no changes', async () => {
            userManagerStore.user = _institutionStudent
            userToUpdate.value = {
                username: _institutionStudent.username,
                firstName: _institutionStudent.firstName,
                lastName: _institutionStudent.lastName,
                email: _institutionStudent.email,
                newEmail: '',
                newEmailVerification: '',
                phone: _institutionStudent.phone
            }
            await updateUserInfos(userManagerStore.user, true)
            const {axiosAuthenticated} = useAxios()
            expect(axiosAuthenticated.patch).toHaveBeenCalledTimes(0)
        })
    })*/
})
