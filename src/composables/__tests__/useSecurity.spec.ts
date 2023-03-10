import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useSecurity from '@/composables/useSecurity'
import {useUserStore} from '@/stores/useUserStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {_tokens} from '~/fixtures/tokens.mock'
import {_institutionManager, _institutionStudent, _newUser} from '~/fixtures/user.mock'
import {useAxios} from '@/composables/useAxios'
import useUserGroups from '@/composables/useUserGroups'
import {_groups} from '~/fixtures/group.mock'


config.global.plugins = [
    createTestingPinia({createSpy: vi.fn()}),
]

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

/*vi.mock('@/composables/useSecurity', () => {
    const composable = vi.importActual('@/composables/useSecurity')
    return {
        ...composable,
        userLocalRegisterAsManager: vi.fn()
    }
})*/

describe('useSecurity', () => {
    let userStore = useUserStore()
    const {newUser} = useSecurity()
    const {groups, newGroups} = useUserGroups()

    beforeEach(() => {
        userStore = useUserStore()
        groups.value = _groups
    })

    afterEach(() => {
        vi.restoreAllMocks()
        groups.value = []
        newGroups.value = []
    })

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

    describe('hasPerm', () => {
        it('should return true if userPermission is in userStore', () => {
            userStore.user = _institutionManager
            const {hasPerm} = useSecurity()
            expect(hasPerm('add_association')).toBeTruthy()
            expect(hasPerm('can_burn_application')).toBeFalsy()
        })
    })

    describe('userLocalRegister', () => {
        it('should call API once on /users/auth/registration/ with newUser as data', async () => {
            const {userLocalRegister, newUser} = useSecurity()
            const {axiosPublic} = useAxios()
            await userLocalRegister()
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenLastCalledWith('/users/auth/registration/', newUser)
        })
    })

    describe('userCASRegister', () => {
        it('should call API once on /users/auth/user/ with new info to patch', async () => {
            const {axiosAuthenticated} = useAxios()
            const {userCASRegister} = useSecurity()
            await userCASRegister('new info to patch')
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/users/auth/user/', {phone: 'new info to patch'})
        })
    })

    /*describe('userAssociationRegister', () => {
        const {axiosPublic, axiosAuthenticated} = useAxios()
        const {userAssociationsRegister} = useSecurity()
        const lastAssociation = _userAssociations[_userAssociations.length - 1]
        const data = {
            user: 'user',
            association: lastAssociation.association,
            isPresident: lastAssociation.isPresident,
            isVicePresident: lastAssociation.isVicePresident,
            isSecretary: lastAssociation.isSecretary,
            isTreasurer: lastAssociation.isTreasurer
        }

        describe('userAssociationRegister', () => {
            it('should post every new association with public instance when registering', async () => {
            await userAssociationsRegister(true, 'user', _userAssociations)
            expect(axiosPublic.post).toHaveBeenCalledTimes(_userAssociations.length)
            expect(axiosPublic.post).toHaveBeenLastCalledWith('/users/associations/', data)
        })

        it('should post every new association with auth instance when registered by manager', async () => {
            await userAssociationsRegister(false, 'user', _userAssociations)
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(_userAssociations.length)
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/users/associations/', data)
        })
    })*/

    describe('userGroupsRegister', () => {
        const {axiosPublic, axiosAuthenticated} = useAxios()
        const {userGroupsRegister} = useSecurity()
        const {newGroups} = useUserGroups()

        it('should new groups with public instance when registering', async () => {
            newGroups.value = [1, 2]

            const data = {
                username: newUser.username,
                group: 2,
                institution: null,
                commission: null
            }

            await userGroupsRegister(true)
            expect(axiosPublic.post).toHaveBeenCalledTimes(newGroups.value.length)
            expect(axiosPublic.post).toHaveBeenLastCalledWith('/users/groups/', data)
        })

        it('should new groups with auth instance when registered by manager', async () => {
            newGroups.value = [1, 2]

            const data = {
                username: newUser.username,
                group: 2,
                institution: null,
                commission: null
            }

            await userGroupsRegister(false)
            expect(axiosAuthenticated.post).toHaveBeenCalledTimes(newGroups.value.length)
            expect(axiosAuthenticated.post).toHaveBeenLastCalledWith('/users/groups/', data)
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

    describe('resendEmail', () => {
        it('should post once on /users/auth/registration/resend-email/ with email as payload', async () => {
            const {axiosPublic} = useAxios()
            const {resendEmail} = useSecurity()
            await resendEmail('test@email.com')
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenCalledWith('/users/auth/registration/resend-email/', {email: 'test@email.com'})
        })
    })

    describe('passwordReset', () => {
        it('should post once on /users/auth/password/reset with user email as data', () => {
            const {axiosPublic} = useAxios()
            const {passwordReset} = useSecurity()
            passwordReset(_institutionStudent.email)
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenCalledWith('/users/auth/password/reset/', {email: _institutionStudent.email})
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

    /*describe('register', () => {
        const {
            register,
            newUser,
            userCASRegister
        } = useSecurity()
        const {newAssociations} = useUserAssociations()
        const {newGroups} = useUserGroups()
        //const {axiosPublic} = useAxios()
        //const mockedAxios = vi.mocked(axiosPublic, true)

        describe('if newUser isCas', () => {
            it('should execute CASUser, groups and associations registration, then unLoad newUser', async () => {
                userStore.newUser = _newUser
                userStore.newUser.isCas = true
                newUser.phone = '00 00 00 00 00'
                newAssociations.value = [_associationRole]
                newGroups.value = [6]
                const composable = useSecurity()
                const userCASRegister = vi.spyOn(composable, 'userCASRegister')
                const unLoadNewUser = vi.spyOn(userStore, 'unLoadNewUser')

                await composable.register()

                //expect(userCASRegister).toHaveBeenCalledOnce()
                //expect(spies.userAssociationsRegister).toHaveBeenCalledOnce()
                //expect(spies.userGroupsRegister).toHaveBeenCalledOnce()
                expect(userCASRegister).toHaveBeenCalledOnce()
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
})

/*describe('addUserAsManager', () => {
    const {newAssociationsUser} = useAssociation()
    const {addUserAsManager, userLocalRegisterAsManager} = useSecurity()

    it('should register a new user with associations if any', async () => {
        expect(userLocalRegisterAsManager).toHaveBeenCalledOnce()
    })
})*/


})
