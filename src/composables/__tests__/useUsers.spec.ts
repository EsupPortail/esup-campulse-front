import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import useUsers from '@/composables/useUsers'
import useSecurity from '@/composables/useSecurity'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useUserStore} from '@/stores/useUserStore'
import useUserGroups from '@/composables/useUserGroups'
import {_groups} from '~/fixtures/group.mock'
import {
    _institutionStudent,
    _miscStudent,
    _newUser,
    _userAssociationDetail,
    //_userAssociations,
    _users
} from '~/fixtures/user.mock'
import {useAxios} from '@/composables/useAxios'
import type {AxiosResponse} from 'axios'
import {_tokens, tokenMock} from '~/fixtures/tokens.mock'
import type {DocumentProcessType} from '#/documents'
import {_documentUploads} from '~/fixtures/project.mock'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composables/useSecurity', () => ({
    default: () => ({
        setTokens: tokenMock,
        removeTokens: tokenMock,
    })
}))

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

setActivePinia(createPinia())

describe('useUsers', () => {
    let userManagerStore = useUserManagerStore()
    let userComposable = useUsers()
    let userStore = useUserStore()

    beforeEach(() => {
        userManagerStore = useUserManagerStore()
        userStore = useUserStore()
        userComposable = useUsers()
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

    describe('initInfosToPatch', () => {
        describe('if first and last names are updated', () => {
            it('should clean infosToPatch object fields and assign new fields if updated', () => {
                const {initInfosToPatch, infosToPatch, userToUpdate} = useUsers()
                userToUpdate.value = {
                    firstName: 'Prénom',
                    lastName: 'Nom',
                    username: 'nom-prenom@mail.tld',
                    email: 'nom-prenom@mail.tld',
                    newEmail: 'new-nom-prenom@mail.tld',
                    newEmailVerification: 'new-nom-prenom@mail.tld',
                    phone: '0102030405',
                    address: '10 rue du campus',
                    zipcode: '67000',
                    city: 'strasbourg',
                    country: 'france'
                }
                initInfosToPatch(_institutionStudent)
                expect(infosToPatch).toEqual({
                    firstName: 'Prénom',
                    lastName: 'Nom',
                    email: 'new-nom-prenom@mail.tld',
                    phone: '0102030405',
                    address: '10 rue du campus',
                    zipcode: '67000',
                    city: 'strasbourg',
                    country: 'france'
                })
            })
        })
        describe('if first and last names are not updated', () => {
            it('should clean infosToPatch object fields and assign new fields if updated', () => {
                const {initInfosToPatch, infosToPatch, userToUpdate} = useUsers()
                userToUpdate.value = {
                    firstName: 'Student',
                    lastName: 'Institution',
                    username: 'nom-prenom@mail.tld',
                    email: 'nom-prenom@mail.tld',
                    newEmail: 'new-nom-prenom@mail.tld',
                    newEmailVerification: 'new-nom-prenom@mail.tld',
                    phone: '0102030405',
                    address: '10 rue du campus',
                    zipcode: '67000',
                    city: 'strasbourg',
                    country: 'france'
                }
                initInfosToPatch(_institutionStudent)
                expect(infosToPatch).toEqual({
                    email: 'new-nom-prenom@mail.tld',
                    phone: '0102030405',
                    address: '10 rue du campus',
                    zipcode: '67000',
                    city: 'strasbourg',
                    country: 'france'
                })
            })
        })
    })

    describe('advancedSearch', () => {
        const {advancedSearch} = useUsers()
        userManagerStore.users = _users
        describe('if at least one search field is filled', () => {
            it('should return matching users if matches are found', () => {
                const matches = advancedSearch({
                    search: '',
                    firstName: 'Student',
                    lastName: 'Misc',
                    email: 'misc-student@unistra.fr',
                    association: null
                })
                expect(matches).toEqual([_miscStudent])
            })
            it('should return an empty array if no matching users are found', () => {
                const matches = advancedSearch({
                    search: '',
                    firstName: 'Chantal',
                    lastName: '',
                    email: '',
                    association: null
                })
                expect(matches).toEqual([])
            })
        })
        describe('if at no field is filled', () => {
            it('should return undefined', () => {
                const matches = advancedSearch({
                    search: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    association: null
                })
                expect(matches).toEqual(undefined)
            })
        })
    })

    describe('getUser', () => {
        afterEach(() => {
            userStore.user = undefined
            userStore.newUser = undefined
            _institutionStudent.isValidatedByAdmin = true
            _institutionStudent.isCas = false
        })

        const {axiosAuthenticated} = useAxios()
        const mockedAxios = vi.mocked(axiosAuthenticated, true)

        it('should getUser if user is validated by admin', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent} as AxiosResponse)
            const {getUser} = useUsers()
            await getUser()
            expect(userStore.user).toEqual(_institutionStudent)
            expect(userStore.newUser).toBeUndefined()
        })

        it('should populate newUser if user is not validated by admin and CAS', async () => {
            _institutionStudent.isValidatedByAdmin = false
            _institutionStudent.isCas = true
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent} as AxiosResponse)
            const {getUser} = useUsers()
            await getUser()
            expect(userStore.user).toBeUndefined()
            expect(userStore.newUser).toEqual({
                firstName: _institutionStudent.firstName,
                lastName: _institutionStudent.lastName,
                isCas: true,
                username: _institutionStudent.username,
                email: _institutionStudent.email,
                phone: _institutionStudent.phone as string
            })
        })

        it('should logOut if user if not validated by admin and not CAS', async () => {
            _institutionStudent.isValidatedByAdmin = false
            mockedAxios.get.mockResolvedValueOnce({data: _institutionStudent} as AxiosResponse)
            const logOut = vi.spyOn(userStore, 'logOut')
            await userComposable.getUser()
            expect(logOut).toHaveBeenCalledOnce()
            expect(userStore.user).toBeUndefined()
            expect(userStore.newUser).toBeUndefined()
        })

        /*        describe('unLoadUser', () => {
            it('should clear all data from user', () => {
                userStore.user = _institutionStudent
                userStore.userAssociations = _userAssociations
                userStore.unLoadUser()
                expect(userStore.user).toBeUndefined()
                expect(userStore.userAssociations).toEqual([])
            })
        })*/

        describe('unLoadNewUser', () => {
            it('should remove tokens and remove all data from newUser', () => {
                userStore.newUser = _newUser
                localStorage.setItem('JWT__access__token', _tokens.access)
                localStorage.setItem('JWT__refresh__token', _tokens.refresh)
                userStore.unLoadNewUser()
                const {removeTokens} = useSecurity()
                expect(removeTokens).toHaveBeenCalledOnce()
                expect(userStore.newUser).toBeUndefined()
            })
        })

        describe('hasPresidentStatus', () => {
            afterEach(() => {
                userStore.userAssociations = []
            })
            it('should return true if isPresident', () => {
                userStore.userAssociations = [_userAssociationDetail]
                expect(userStore.hasPresidentStatus(1)).toBeTruthy()
            })
            it('should return false if is not President', () => {
                userStore.userAssociations = [_userAssociationDetail]
                userStore.userAssociations[0].isPresident = false
                expect(userStore.hasPresidentStatus(1)).toBeFalsy()
            })
        })

        describe('getUserDocuments', () => {
            const {axiosAuthenticated} = useAxios()
            const mockedAxios = vi.mocked(axiosAuthenticated, true)
            const userId = _institutionStudent.id
            const processTypes: DocumentProcessType[] = ['DOCUMENT_PROJECT', 'DOCUMENT_ASSOCIATION']

            describe('if process types are given', () => {
                beforeEach(() => {
                    mockedAxios.get.mockResolvedValueOnce({data: _documentUploads})
                    userStore.user = _institutionStudent
                })

                it('should get user document uploads corresponding to the process types', async () => {
                    await userStore.getUserDocuments(processTypes)
                    const url = `/documents/uploads?user_id=${userId}&process_types=${processTypes.join(',')}`
                    expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                    expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                    expect(userStore.userDocuments).toEqual(_documentUploads)
                })
            })

            describe('if no specific process types are given', () => {
                beforeEach(() => {
                    mockedAxios.get.mockResolvedValueOnce({data: _documentUploads})
                    userStore.user = _institutionStudent
                })

                it('should get all user document uploads', async () => {
                    await userStore.getUserDocuments()
                    const url = `/documents/uploads?user_id=${userId}`
                    expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
                    expect(axiosAuthenticated.get).toHaveBeenCalledWith(url)
                    expect(userStore.userDocuments).toEqual(_documentUploads)
                })
            })
        })
    })
})
