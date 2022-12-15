import {mockedAxios} from "~/mocks/axios.mock";
import {association} from "~/mocks/association.mock";
import useAssociation from "@/composables/useAssociation";
import {describe, expect, it, vi} from "vitest";
import {config} from "@vue/test-utils";
import {createTestingPinia} from "@pinia/testing";
import {useAssociationStore} from "../../stores/useAssociationStore";

vi.mock('vue-router', () => ({useRoute: vi.fn()}))

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useAssociation', () => {
    const associationStore = useAssociationStore()
    associationStore.association = association

    // Test to create a new association
    describe('Create an association', () => {
        it('should call API only once on /associations/ with name as payload', async () => {
            const {createAssociation} = useAssociation()
            await createAssociation("Association test")
            expect(mockedAxios.post).toHaveBeenCalledOnce()
            expect(mockedAxios.post).toHaveBeenCalledWith('/associations/', {name: 'Association test'})
        })
    })

    // Test to delete an association
    describe('Delete an association', () => {
        it('should call API only once on /associations/ with id as payload', async () => {
            const {deleteAssociation} = useAssociation()
            await deleteAssociation()
            expect(mockedAxios.delete).toHaveBeenCalledOnce()
            expect(mockedAxios.delete).toHaveBeenCalledWith(`/associations/${association.id}`)
        })
    })

    // Test to edit an association
})