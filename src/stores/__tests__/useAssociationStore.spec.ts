import type {AxiosResponse} from 'axios'
import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import type {Association} from '#/association'
import {_association, _associationNames, _associations} from '~/fixtures/association.mock'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useUserStore} from '@/stores/useUserStore'
import {_user} from '~/fixtures/user.mock'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())
let associationStore = useAssociationStore()
let userStore = useUserStore()

describe('Association store', () => {
    beforeEach(() => {
        associationStore = useAssociationStore()
    })
    afterEach(() => {
        associationStore.associations = []
        vi.restoreAllMocks()
    })
    describe('getAssociations', () => {
        beforeEach(() => {
            const {axiosPublic} = useAxios()
            const mockedAxios = vi.mocked(axiosPublic, true)
            mockedAxios.get.mockResolvedValueOnce({data: _associations} as AxiosResponse)
        })
        describe('If forDirectory is true', () => {
            beforeEach(() => {
                associationStore.getAssociations(true, false)
            })
            it('should call API once on /associations/?is_public=true', () => {
                const {axiosPublic} = useAxios()
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/associations/?is_public=true')
            })
        })
        describe('If forRegistration is true', () => {
            beforeEach(() => {
                associationStore.getAssociations(false, true)
            })
            it('should call API once on /associations/?is_enabled=true', () => {
                const {axiosPublic} = useAxios()
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/associations/?is_enabled=true')
            })
        })
        describe('If forDirectory and forRegistration are false', () => {
            beforeEach(() => {
                associationStore.getAssociations(false, false)
            })
            it('should call API once on /associations/ and get all associations', () => {
                const {axiosPublic} = useAxios()
                expect(axiosPublic.get).toHaveBeenCalledOnce()
                expect(axiosPublic.get).toHaveBeenCalledWith('/associations/')
            })
        })
    })
    describe('getManagedAssociations', () => {
        beforeEach(() => {
            userStore = useUserStore()
            const {axiosPublic} = useAxios()
            const mockedAxios = vi.mocked(axiosPublic, true)
            mockedAxios.get.mockResolvedValueOnce({data: _associations} as AxiosResponse)
        })
        afterEach(() => {
            userStore.user = undefined
        })
        describe('If isUniManager', () => {
            it('should execute getAssociations to get all associations', async () => {
                userStore.user = _user
                const spy = vi.spyOn(associationStore, 'getAssociations')
                await associationStore.getManagedAssociations()
                expect(spy).toHaveBeenCalledOnce()
                expect(spy).toHaveBeenCalledWith(false, false)
            })
        })
        describe('If student', () => {
            it('should only get this student\'s associations', async () => {
                userStore.user = _user
                userStore.user.groups.splice(0, 1)
                const spy = vi.spyOn(associationStore, 'getAssociations')
                await associationStore.getManagedAssociations()
                expect(spy).toHaveBeenCalledTimes(0)
                expect(associationStore.associations).toEqual([_associations])
            })
        })
    })
    describe('Get association detail', () => {
        beforeEach(() => {
            const {axiosPublic} = useAxios()
            const mockedAxios = vi.mocked(axiosPublic, true)
            mockedAxios.get.mockResolvedValueOnce({data: _association} as AxiosResponse)
            associationStore.getAssociationDetail(_association.id)
        })
        afterEach(() => {
            associationStore.association = {} as Association
        })
        it('should populate association in the store', () => {
            expect(associationStore.association).toEqual(_association)
        })
        it('should be called once', () => {
            const {axiosPublic} = useAxios()
            expect(axiosPublic.get).toHaveBeenCalledOnce()
        })
        it('should call API on /associations/id', () => {
            const {axiosPublic} = useAxios()
            expect(axiosPublic.get).toHaveBeenCalledWith(`/associations/${_association.id}`)
        })
    })
    describe('Association names', () => {
        beforeEach(() => {
            associationStore.associations = _associations
        })
        afterEach(() => {
            associationStore.associations = []
        })
        it('should contain all the associations', () => {
            expect(associationStore.associationNames.length).toEqual(_associations.length)
        })
        it('should contain associations with labels and lists', () => {
            expect(associationStore.associationNames).toEqual(_associationNames)
        })
    })
    /*describe('Delete associations', () => {
        beforeEach(() => {
            associationStore.associations = [...associations]
            associationStore.association = association
            associationStore.deleteAssociation()
        })
        it('should change associations data', () => {
            expect(associationStore.associations.length).toEqual(associations.length - 1)
        })
        it('should be called once', () => {
            expect(mockedAxios.delete).toHaveBeenCalledOnce()
        })
        it('should call API on /associations/', () => {
            expect(mockedAxios.delete).toHaveBeenCalledWith(`/associations/${association.id}`)
        })
    })*/
})
