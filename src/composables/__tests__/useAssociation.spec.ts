import {mockedAxios} from "~/mocks/axios.mock";
import useAssociation from "@/composables/useAssociation";
import {describe, expect, it} from "vitest";

describe('useAssociation', () => {
    const {createAssociation} = useAssociation()

    // Test to create a new association
    describe('Create an association', () => {
        it('should call API only once on /associations/ with name as payload', async () => {
            await createAssociation("Association test")
            expect(mockedAxios.post).toHaveBeenCalledOnce()
            expect(mockedAxios.post).toHaveBeenCalledWith('/associations/', {name: 'Association test'})
        })
    })

    // Test to delete an association


    // Test to edit an association
})