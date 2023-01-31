import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {mockedAxios} from '~/mocks/axios.mock'
import {mockedUser, mockedUserAssociations, mockedUserGroups} from '~/mocks/user.mock'
import useAssociation from '@/composables/useAssociation'
import useSecurity from '@/composables/useSecurity'
import useUserGroups from '@/composables/useUserGroups'
import * as userService from '@/services/userService'
import {useUserStore} from '@/stores/useUserStore'

vi.mock('@/plugins/axios')

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
        it('should call logIn function in userStore with API route and user infos as payload', async () => {
            const {logIn, user} = useSecurity()
            const spy = vi.spyOn(userStore, 'logIn')
            user.value.username = 'john'
            user.value.password = 'password'
            await logIn()
            expect(spy).toHaveBeenCalledOnce()
            expect(spy).toHaveBeenCalledWith('/users/auth/login/', user.value)
        })
    })
    describe('register', () => {
        const {register, newUser} = useSecurity()
        const {newAssociations} = useAssociation()
        const {newGroups} = useUserGroups()
        const spies = {
            userCASRegister: vi.spyOn(userService, 'userCASRegister'),
            userGroupsRegister: vi.spyOn(userService, 'userGroupsRegister'),
            userAssociationRegister: vi.spyOn(userService, 'userAssociationsRegister'),
            userLocalRegister: vi.spyOn(userService, 'userLocalRegister'),
            unLoadNewUser: vi.spyOn(userStore, 'unLoadNewUser')
        }
        beforeEach(() => {
            newUser.value = mockedUser
            mockedAxios.post.mockResolvedValue({})
            mockedAxios.patch.mockResolvedValue({})
        })
        describe('if newUser isCas', () => {
            beforeEach(() => {
                newUser.value.isCas = true
                userStore.newUser = newUser.value
            })
            it('should execute CASUser, groups and associations registration, then unLoad newUser', async () => {
                newUser.value.phone = '00 00 00 00 00'
                newAssociations.value = mockedUserAssociations
                newGroups.value = mockedUserGroups
                await register()
                expect(spies.userCASRegister).toHaveBeenCalledOnce()
                expect(spies.userAssociationRegister).toHaveBeenCalledOnce()
                expect(spies.userGroupsRegister).toHaveBeenCalledOnce()
                expect(spies.unLoadNewUser).toHaveBeenCalledOnce()
            })
        })
        describe('if newUser is not Cas', () => {
            beforeEach(() => {
                newUser.value.isCas = false
                userStore.newUser = newUser.value
            })
            it('should execute LocalUser, association and groups register', async () => {
                newAssociations.value = mockedUserAssociations
                newGroups.value = mockedUserGroups
                await register()
                expect(spies.userLocalRegister).toHaveBeenCalledOnce()
                expect(spies.userAssociationRegister).toHaveBeenCalledOnce()
                expect(spies.userGroupsRegister).toHaveBeenCalledOnce()
            })
        })
    })
})
