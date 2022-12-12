import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {mockedAxios} from '~/mocks/axios.mock'
import {mockedGroupList, mockedGroups} from '~/mocks/user.mock'
import useUserGroups from '@/composables/useUserGroups'

const {getGroups, groups, groupList, studentGroup} = useUserGroups()

describe('Get groups', () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValueOnce({data: mockedGroups})
        groups.value = []
    })
    afterEach(() => {
        mockedAxios.get.mockRestore()
    })
    describe('If groups are not populated yet', () => {
        beforeEach(() => {
            getGroups()
        })
        it('should get user groups', () => {
            expect(groups.value).toEqual(mockedGroups)
        })
        it('should be called once', () => {
            expect(mockedAxios.get).toHaveBeenCalledOnce()
        })
        it('should call API on /groups/', () => {
            expect(mockedAxios.get).toHaveBeenCalledWith('/groups/')
        })
    })
    describe('If groups are already populated', () => {
        beforeEach(() => {
            groups.value = mockedGroups
            getGroups()
        })
        it('should be called once', () => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(0)
        })
    })
})
describe('Group list', () => {
    it('should create an array of value and label for each group', () => {
        groups.value = mockedGroups
        expect(groupList.value).toEqual(mockedGroupList)
    })
})
describe('Student group', () => {
    it('should return the student group object', () => {
        groups.value = mockedGroups
        expect(studentGroup.value).toEqual(mockedGroups[1])
    })
})
