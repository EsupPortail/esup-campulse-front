import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mockedAxios } from '~/mocks/axios.mock'
import { useAssociationStore } from '@/stores/useAssociationStore'
import type { AxiosResponse } from 'axios'
import { association, associationDirectory, associationNames, associations } from '~/mocks/association.mock'
import type { Association } from '#/association'


setActivePinia(createPinia())
let associationStore = useAssociationStore()

describe('Association store', () => {
    beforeEach(() => {
        associationStore = useAssociationStore()
    })
    afterEach(() => {
        associationStore.associations = []
        vi.restoreAllMocks()
    })
    describe('Get associations', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({ data: associations } as AxiosResponse)
        })
        describe('If associations are not populated', () => {
            beforeEach(() => {
                associationStore.getAssociations()
            })
            it('should populate associations in the store', () => {
                expect(associationStore.associations).toEqual(associations)
            })
            it('should be called once', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
            })
            it('should call API on /associations/', () => {
                expect(mockedAxios.get).toHaveBeenCalledWith('/associations/')
            })
        })
        describe('If associations are populated', () => {
            beforeEach(() => {
                associationStore.associations = associations
                associationStore.getAssociations()
            })
            it('should not be called if associations are populated', () => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(0)
            })
            it('should keep associations data', () => {
                expect(associationStore.associations).toEqual(associations)
            })
        })
    })
    describe('Get association detail', () => {
        describe('If association is not the same', () => {
            beforeEach(() => {
                mockedAxios.get.mockResolvedValueOnce({ data: association } as AxiosResponse)
                associationStore.getAssociationDetail(association.id)
            })
            afterEach(() => {
                associationStore.association = {} as Association
            })
            it('should populate association in the store', () => {
                expect(associationStore.association).toEqual(association)
            })
            it('should be called once', () => {
                expect(mockedAxios.get).toHaveBeenCalledOnce()
            })
            it('should call API on /associations/id', () => {
                expect(mockedAxios.get).toHaveBeenCalledWith(`/associations/${association.id}`)
            })
        })
        describe('If association is the same', () => {
            beforeEach(() => {
                associationStore.association = association
                mockedAxios.get.mockResolvedValueOnce({ data: association } as AxiosResponse)
                associationStore.getAssociationDetail(association.id)
            })
            afterEach(() => {
                associationStore.association = {} as Association
            })
            it('should not be executed', () => {
                expect(mockedAxios.get).toHaveBeenCalledTimes(0)
            })
            it('should keep association data', () => {
                expect(associationStore.association).toEqual(association)
            })
        })
    })
    describe('Association names', () => {
        beforeEach(() => {
            associationStore.associations = associations
        })
        afterEach(() => {
            associationStore.associations = []
        })
        it('should contain all the associations', () => {
            expect(associationStore.associationNames.length).toEqual(associations.length)
        })
        it('should contain associations with labels and lists', () => {
            expect(associationStore.associationNames).toEqual(associationNames)
        })
    })
    describe('Association directory', () => {
        beforeEach(() => {
            associationStore.associations = associations
        })
        afterEach(() => {
            associationStore.associations = []
        })
        it('should contain all associations', () => {
            expect(associationStore.associationDirectory.length).toEqual(associations.length)
        })
        it('should contain associations with id, name, acronym, institution; component and field', () => {
            expect(associationStore.associationDirectory).toEqual(associationDirectory)
        })
    })
    describe('Delete associations', () => {
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
    })
})
