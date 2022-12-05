import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {mockedAxios} from '~/mocks/axios.mock'
import {useAssociationStore} from '@/stores/useAssociationStore'
import type {AxiosResponse} from 'axios'
import {associationList, associations} from '~/mocks/association.mock'


setActivePinia(createPinia())
let associationStore = useAssociationStore()

describe('Association store', () => {
    beforeEach(() => {
        associationStore = useAssociationStore()
    })
    describe('Get associations', () => {
        beforeEach(() => {
            mockedAxios.get.mockResolvedValueOnce({data: associations} as AxiosResponse)
            associationStore.getAssociations()
        })
        afterEach(() => {
            mockedAxios.get.mockRestore()
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
    describe('Association list', () => {
        beforeEach(() => {
            associationStore.associations = associations
        })
        it('should contain all the associations', () => {
            expect(associationStore.associationDirectory.length).toEqual(associations.length)
        })
        it('should contain associations with labels and lists', () => {
            expect(associationStore.associationDirectory).toEqual(associationList)
        })
    })
})
