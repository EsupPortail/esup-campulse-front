import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useSecurity from '@/composables/useSecurity'
import {useUserStore} from '@/stores/useUserStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {_tokens} from "../../../tests/fixtures/tokens.mock";
import {useAxios} from "../useAxios";
import {_newUser, _newUserGroups, _user} from "../../../tests/fixtures/user.mock";

config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

describe('useSecurity', () => {
    let userStore = useUserStore()

    beforeEach(() => {
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })
    // OK
    describe('logIn', () => {
        it('should call logIn function in userStore with API route and user infos as payload', async () => {
            const {logIn, user} = useSecurity()
            user.value = {
                username: 'john',
                password: 'password'
            }
            const spy = vi.spyOn(userStore, 'logIn')
            await logIn()
            expect(spy).toHaveBeenCalledOnce()
            expect(spy).toHaveBeenCalledWith('/users/auth/login/', user.value)
        })
    })
    /* describe('register', () => {
         const {
             register,
             newUser,
             userCASRegister
         } = useSecurity()
         const {newAssociations} = useAssociation()
         const {newGroups} = useUserGroups()

         beforeEach(() => {
             newUser.value = _newUser

             const {axiosPublic} = useAxios()
             const mockedAxios = vi.mocked(axiosPublic, true)
             mockedAxios.post.mockResolvedValue({})
             mockedAxios.patch.mockResolvedValue({})
         })*/

    /*describe('if newUser isCas', () => {
        it('should execute CASUser, groups and associations registration, then unLoad newUser', async () => {
            newUser.value.isCas = true
            userStore.newUser = newUser.value
            newUser.value.phone = '00 00 00 00 00'
            newAssociations.value = _userAssociations
            newGroups.value = _userGroupList


            const unLoadNewUser = vi.spyOn(userStore, 'unLoadNewUser')

            await register()

            expect(userCASRegister).toHaveBeenCalledOnce()
            //expect(spies.userAssociationsRegister).toHaveBeenCalledOnce()
            //expect(spies.userGroupsRegister).toHaveBeenCalledOnce()
            expect(unLoadNewUser).toHaveBeenCalledOnce()
        })
    })*/
    /*describe('if newUser is not Cas', () => {
        beforeEach(() => {
            newUser.value.isCas = false
            userStore.newUser = newUser.value
        })
        it('should execute localUser, association and groups register', async () => {
            newAssociations.value = _userAssociations
            newGroups.value = _userGroupList
            await register()
            expect(spies.userLocalRegister).toHaveBeenCalledOnce()
            expect(spies.userAssociationsRegister).toHaveBeenCalledOnce()
            expect(spies.userGroupsRegister).toHaveBeenCalledOnce()
        })
    })
})*/
    describe('setTokens', () => {
        it('should set access and refresh tokens', () => {
            const {setTokens} = useSecurity()
            setTokens(_tokens.access, _tokens.refresh)
            expect(localStorage.getItem('JWT__access__token')).toBe(_tokens.access)
            expect(localStorage.getItem('JWT__refresh__token')).toBe(_tokens.refresh)
        })
    })
    describe('removeTokens', () => {
        it('should unset access and refresh tokens', () => {
            const {removeTokens} = useSecurity()
            removeTokens()
            expect(localStorage.getItem('JWT__access__token')).toBeNull()
            expect(localStorage.getItem('JWT__refresh__token')).toBeNull()
        })
    })
    describe('userLocalRegister', () => {
        it('should call API once on /users/auth/registration/ with newUser as data', async () => {
            const {userLocalRegister} = useSecurity()
            const {axiosPublic} = useAxios()
            await userLocalRegister(_newUser)
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenLastCalledWith('/users/auth/registration/', _newUser)
        })
    })
    describe('userCASRegister', () => {
        it('should call API once on /users/auth/user/ with new info to patch', async () => {
            const {axiosPublic} = useAxios()
            const {setTokens, userCASRegister} = useSecurity()
            setTokens(_tokens.access, _tokens.refresh)
            await userCASRegister('new info to patch')
            expect(axiosPublic.patch).toHaveBeenCalledOnce()
            expect(axiosPublic.patch).toHaveBeenCalledWith('/users/auth/user/', {phone: 'new info to patch'})
        })
    })
    /*describe('userAssociationRegister', () => {
        it('should call API for each association /users/associations/ with user, association id and other data', () => {
            const {axiosPublic} = useAxios()
            const {userAssociationsRegister} = useSecurity()
            userAssociationsRegister(_newUser.username, _userAssociations)
            expect(axiosPublic.post).toHaveBeenCalledTimes(_userAssociations.length)
            expect(axiosPublic.post).toHaveBeenLastCalledWith('/users/associations/',
                {
                    user: _newUser.username,
                    association: _userAssociations[(_userAssociations.length) - 1].id,
                    roleName: _userAssociations[(_userAssociations.length) - 1].roleName,
                    hasOfficeStatus: _userAssociations[(_userAssociations.length) - 1].hasOfficeStatus,
                    isPresident: _userAssociations[(_userAssociations.length) - 1].isPresident
                }
            )
        })
    })*/
    describe('userGroupsRegister', () => {
        it('should call API once on /users/groups/ with username and newUserGroups as data', async () => {
            const {axiosPublic} = useAxios()
            const {userGroupsRegister} = useSecurity()
            await userGroupsRegister(_user.username, _newUserGroups)
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenCalledWith('/users/groups/', {
                username: _user.username,
                groups: _newUserGroups
            })
        })
    })
    describe('userLocalRegisterAsManager', () => {
        it('should post once on /users/ with newUser as data', async () => {
            const {axiosAuthenticated} = useAxios()
            const {userLocalRegisterAsManager} = useSecurity()
            await userLocalRegisterAsManager(_newUser)
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/users/', _newUser)
        })
    })
    describe('verifyEmail', () => {
        it('should post once on /users/auth/registration/verify-email/ with key as data', async () => {
            const {axiosAuthenticated} = useAxios()
            const {verifyEmail} = useSecurity()
            await verifyEmail('key')
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/users/auth/registration/verify-email/', {key: 'key'})
        })
    })
    describe('passwordReset', () => {
        it('should post once on /users/auth/password/reset with user email as data', () => {
            const {axiosPublic} = useAxios()
            const {passwordReset} = useSecurity()
            passwordReset(_user.email)
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenCalledWith('/users/auth/password/reset/', {email: _user.email})
        })
    })
    describe('passwordResetConfirm', () => {
        it('should post once on /users/auth/password/reset/confirm/ with uid, token, and new password as data', async () => {
            const {axiosPublic} = useAxios()
            const {passwordResetConfirm} = useSecurity()
            await passwordResetConfirm('uid', 'token', 'newPassword', 'newPassword')
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenCalledWith('/users/auth/password/reset/confirm/',
                {
                    uid: 'uid',
                    token: 'token',
                    newPassword1: 'newPassword',
                    newPassword2: 'newPassword'
                }
            )
        })
    })
})

