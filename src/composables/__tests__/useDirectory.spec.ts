import {beforeEach, describe, expect, it} from 'vitest'
import useDirectory from '@/composables/useDirectory'
import {createPinia, setActivePinia} from "pinia";
import {mockedAxios} from "~/mocks/axios.mock";

describe('useDirectory', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    describe('Get association detail', () => {
        it('should call getAssociationDetail in store', async () => {
            const {getAssociationDetail} = useDirectory()
            mockedAxios.get.mockResolvedValueOnce(() => ([]))

            await getAssociationDetail('1')
            expect(mockedAxios.get).toBeCalled()
        })
    })
})