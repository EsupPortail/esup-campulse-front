import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_institutionManager, _institutionStudent, _userGroups} from '~/fixtures/user.mock'
import useUserGroups from '@/composables/useUserGroups'
import {config} from '@vue/test-utils'
import {createTestingPinia} from '@pinia/testing'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'
import {_groups} from '~/fixtures/group.mock'
import {useUserStore} from '@/stores/useUserStore'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

describe('useUserGroups', () => {
    let userManagerStore = useUserManagerStore()
    let userStore = useUserStore()
    const {groups, newGroups} = useUserGroups()


    beforeEach(() => {
        userManagerStore = useUserManagerStore()
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        groups.value = []
        newGroups.value = []
        userManagerStore.user = undefined
    })

    describe('getGroups', () => {
        const {getGroups, groups} = useUserGroups()
        const {axiosPublic} = useAxios()
        const mockedAxios = vi.mocked(axiosPublic, true)

        it('should call API once on /groups/ and get user groups', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _userGroups})
            const {axiosPublic} = useAxios()
            await getGroups()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/groups/')
            expect(groups.value).toEqual(_userGroups)
        })
    })

    describe('getGroupLiteral', () => {
        const {groups, getGroupLiteral} = useUserGroups()

        it('should return the literal name of the group', () => {
            groups.value = _groups
            const literalName = getGroupLiteral(1)
            expect(literalName).toEqual('Gestionnaire général')
        })
    })

    /*describe('initGroupLabels', () => {
        const {groups, initGroupLabels, groupLabels} = useUserGroups()

        beforeEach(() => {
            groups.value = _groups
        })

        it('should return all group labels sorted alphabetically and assign it groupLabels', () => {
            initGroupLabels(false)
            expect(groupLabels.value).toEqual(_privateGroupLabels)
        })

        it('should return only public group labels sorted alphabetically and assign it groupLabels', () => {
            initGroupLabels(true)
            expect(groupLabels.value).toEqual(_publicGroupLabels)
        })
    })*/

    describe('preSelectGroup', () => {
        const {groups, preSelectGroup, newGroups} = useUserGroups()

        it('should push to newGroups a group we need to preselect', () => {
            groups.value = _groups
            preSelectGroup('STUDENT_INSTITUTION')
            expect(newGroups.value).toEqual([6])
        })
    })

    describe('initGroupPermToJoinAssociation', () => {
        const {groups, newGroups, groupCanJoinAssociation, initGroupPermToJoinAssociation} = useUserGroups()

        beforeEach(() => {
            groups.value = _groups
        })

        afterEach(() => {
            newGroups.value = []
        })

        it('should return true if at least one of the groups is enabled to join associations', () => {
            newGroups.value = [6, 7] // student institution & student misc
            initGroupPermToJoinAssociation()
            expect(groupCanJoinAssociation.value).toBeTruthy()
        })

        it('should return false if none of the groups are enabled to join associations', () => {
            newGroups.value = [1, 2] // general manager & institution manager
            initGroupPermToJoinAssociation()
            expect(groupCanJoinAssociation.value).toBeFalsy()
        })
    })

    describe('initStaffStatus', () => {
        const {groups, initStaffStatus, isStaff} = useUserGroups()

        beforeEach(() => {
            groups.value = _groups
        })

        afterEach(() => {
            userStore.user = undefined
        })

        it('should set isStaff to false if the user is not a member of at least one private group', async () => {
            userStore.user = _institutionStudent
            await initStaffStatus()
            expect(isStaff.value).toBeFalsy()
        })

        it('should set isStaff to true if the user is a member of at least one private group', async () => {
            userStore.user = _institutionManager
            await initStaffStatus()
            expect(isStaff.value).toBeTruthy()
        })
    })

    describe('groupsToDelete', () => {
        const {groupsToDelete} = useUserGroups()
        const oldGroups = [1, 2, 3]
        const newGroups = [1, 4, 5]

        it('should return groups that are in oldGroups but not in newGroups', () => {
            const result = groupsToDelete(newGroups, oldGroups)
            expect(result).toEqual([2, 3])
        })
    })

    describe('groupsToAdd', () => {
        const {groupsToAdd} = useUserGroups()
        const oldGroups = [1, 2, 3]
        const newGroups = [1, 4, 5]

        it('should return groups that are in oldGroups but not in newGroups', () => {
            const result = groupsToAdd(newGroups, oldGroups)
            expect(result).toEqual([4, 5])
        })
    })

    describe('updateUserGroups', () => {
        const {updateUserGroups} = useUserGroups()

        const spies = {
            updateUserGroups: vi.spyOn(userManagerStore, 'updateUserGroups'),
            deleteUserGroups: vi.spyOn(userManagerStore, 'deleteUserGroups')
        }

        beforeEach(() => {
            userManagerStore.user = _institutionStudent
        })

        it('should update groups if there are changes', async () => {
            newGroups.value = [7] // student misc
            await updateUserGroups()
            expect(spies.updateUserGroups).toHaveBeenCalledOnce()
            expect(spies.deleteUserGroups).toHaveBeenCalledOnce()
        })
        it('should not update groups if there are no changes', async () => {
            newGroups.value = [6] // student institution
            await updateUserGroups()
            expect(spies.updateUserGroups).toHaveBeenCalledTimes(0)
            expect(spies.deleteUserGroups).toHaveBeenCalledTimes(0)
        })
    })
})
