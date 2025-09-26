import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useSecurity from '@/composables/useSecurity'
import {useUserStore} from '@/stores/useUserStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {_tokens} from '~/fixtures/tokens.mock'
import {_associationRole, _CASUsers, _institutionManager, _institutionStudent,} from '~/fixtures/user.mock'
import {useAxios} from '@/composables/useAxios'
import useUserGroups from '@/composables/useUserGroups'
import {_groups} from '~/fixtures/group.mock'
import useUserAssociations from '../useUserAssociations'


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
    const {
        newUser,
        CASUsers,
        setTokens,
        removeTokens,
        logIn,
        user,
        hasPerm,
        userLocalRegister,
        userCASRegister,
        userAssociationsRegister,
        getUsersFromCAS,
        verifyEmail,
        resendEmail,
        passwordReset,
        passwordResetConfirm,
        addUserAsManager,
        CASUserOptions,
        initCASUserOptions,
        checkPasswordStrength
    } = useSecurity()
    const {axiosAuthenticated, axiosPublic} = useAxios()
    const {groups, newGroups} = useUserGroups()
    const {newAssociations} = useUserAssociations()

    beforeEach(() => {
        userStore = useUserStore()
        groups.value = _groups
    })

    afterEach(() => {
        vi.restoreAllMocks()
        groups.value = []
        newGroups.value = []
        CASUsers.value = []
    })

    describe('setTokens', () => {
        it('should set access and refresh tokens', () => {
            setTokens(_tokens.access, _tokens.refresh)
            expect(localStorage.getItem('JWT__access__token')).toBe(_tokens.access)
            expect(localStorage.getItem('JWT__refresh__token')).toBe(_tokens.refresh)
        })
    })

    describe('removeTokens', () => {
        it('should unset access and refresh tokens', () => {
            removeTokens()
            expect(localStorage.getItem('JWT__access__token')).toBeNull()
            expect(localStorage.getItem('JWT__refresh__token')).toBeNull()
        })
    })

    describe('logIn', () => {
        it('should call logIn function in userStore with API route and user infos as payload', async () => {
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
            expect(hasPerm('add_association')).toBeTruthy()
            expect(hasPerm('can_burn_application')).toBeFalsy()
        })
    })

    describe('userLocalRegister', () => {
        it('should call API once on /users/auth/registration/ with newUser as data', async () => {
            const {newAssociations} = useUserAssociations()

            const user = {
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phone: newUser.phone,
                gifus: [],
                associations: newAssociations.value.map((association) => {
                    return {
                        association: association.id,
                        isPresident: association.role === 'isPresident',
                        isSecretary: association.role === 'isSecretary',
                        isTreasurer: association.role === 'isTreasurer',
                        isVicePresident: association.role === 'isVicePresident'
                    }
                })
            }

            await userLocalRegister()
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenLastCalledWith('/users/auth/registration/', user)
        })
    })

    describe('userCASRegister', () => {
        it('should call API once on /users/auth/user/ with new info to patch', async () => {
            await userCASRegister()
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith('/users/auth/registration/cas/', {
                phone: newUser.phone,
                gifus: [],
                associations: newAssociations.value.map((association) => {
                    return {
                        association: association.id,
                        isPresident: association.role === 'isPresident',
                        isSecretary: association.role === 'isSecretary',
                        isTreasurer: association.role === 'isTreasurer',
                        isVicePresident: association.role === 'isVicePresident'
                    }
                })
            })
        })
    })

    describe('userAssociationRegister', () => {
        const {newAssociations} = useUserAssociations()

        beforeEach(() => {
            newAssociations.value = [_associationRole]
        })

        afterEach(() => {
            newAssociations.value = []
        })

        it('should post every new association with auth instance when registered by manager', async () => {
            const data = {
                user: 1,
                association: _associationRole.id,
                isPresident: _associationRole.role === 'isPresident',
                isVicePresident: _associationRole.role === 'isVicePresident',
                isSecretary: _associationRole.role === 'isSecretary',
                isTreasurer: _associationRole.role === 'isTreasurer'
            }

            await userAssociationsRegister(1)
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/users/associations/', [data])
        })
    })

    describe('getUsersFromCAS', () => {
        it('should get users from CAS via the API', async () => {
            const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)
            mockedAuthAxios.get.mockResolvedValueOnce({data: _CASUsers})
            await getUsersFromCAS('lastName')
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/users/external/?last_name=lastName')
            expect(CASUsers.value).toEqual(_CASUsers)
        })
    })

    describe('initCASUserOptions', () => {
        it('should init values and labels for CAS users', () => {
            CASUsers.value = _CASUsers
            initCASUserOptions()
            expect(CASUserOptions.value).toEqual([
                {
                    value: 'lskywalker',
                    label: 'Luke Skywalker (lskywalker@unistra.fr)'
                },
                {
                    value: 'hsolo',
                    label: 'Han Solo (hsolo@unistra.fr)'
                }
            ])
        })
    })

    describe('addUserAsManager', () => {
        it('should post once on /users/ with newUser as data', async () => {
            const {newAssociations} = useUserAssociations()

            const user = {
                isCas: newUser.isCas,
                username: newUser.username,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                phone: newUser.phone,
                gifus: [],
                associations: newAssociations.value.map((association) => {
                    return {
                        association: association.id,
                        isPresident: association.role === 'isPresident',
                        isSecretary: association.role === 'isSecretary',
                        isTreasurer: association.role === 'isTreasurer',
                        isVicePresident: association.role === 'isVicePresident'
                    }
                })
            }

            await addUserAsManager()
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/users/', user)
        })
    })

    describe('verifyEmail', () => {
        it('should post once on /users/auth/registration/verify-email/ with key as data', async () => {
            await verifyEmail('key')
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/users/auth/registration/verify-email/', {key: 'key'})
        })
    })

    describe('resendEmail', () => {
        it('should post once on /users/auth/registration/resend-email/ with email as payload', async () => {
            await resendEmail('test@email.com')
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenCalledWith('/users/auth/registration/resend-email/', {email: 'test@email.com'})
        })
    })

    describe('passwordReset', () => {
        it('should post once on /users/auth/password/reset with user email as data', () => {
            passwordReset(_institutionStudent.email)
            expect(axiosPublic.post).toHaveBeenCalledOnce()
            expect(axiosPublic.post).toHaveBeenCalledWith('/users/auth/password/reset/', {email: _institutionStudent.email})
        })
    })

    describe('passwordResetConfirm', () => {
        it('should post once on /users/auth/password/reset/confirm/ with uid, token, and new password as data', async () => {
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

    describe('checkPasswordStrength', () => {
        it('should test password strength through regex and plugin ZXCVBN', () => {
            const valid = checkPasswordStrength('ghtRf6è!*tgr5DJn')
            expect(valid).toEqual({
                score: 4,
                valid: true
            })
            const invalid = checkPasswordStrength('coucou')
            expect(invalid).toEqual({
                score: 1,
                valid: false
            })
        })
    })
})
