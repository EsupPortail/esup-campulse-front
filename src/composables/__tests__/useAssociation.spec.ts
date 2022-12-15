import {mockedAxios} from "~/mocks/axios.mock";
import useAssociation from "@/composables/useAssociation";
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
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
    let associationStore = useAssociationStore()

    beforeEach(() => {
        associationStore = useAssociationStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

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
            const spy = vi.spyOn(associationStore, 'getAssociations')
            const {deleteAssociation} = useAssociation()
            await deleteAssociation()
            expect(spy).toHaveBeenCalledOnce()

        })
    })

    // Test to edit an association
})