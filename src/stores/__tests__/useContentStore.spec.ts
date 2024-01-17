import {createPinia, setActivePinia} from 'pinia'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {useAxios} from '@/composables/useAxios'
import {useContentStore} from '@/stores/useContentStore'
import {_contents, _logos} from '~/fixtures/contents.mock'
import type {ContentCode} from '#/index'


vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

setActivePinia(createPinia())
let contentStore = useContentStore()

describe('Content store', () => {
    const {axiosPublic} = useAxios()
    const mockedAxios = vi.mocked(axiosPublic, true)

    beforeEach(() => {
        contentStore = useContentStore()
    })
    afterEach(() => {
        vi.restoreAllMocks()
        contentStore.contents = []
    })

    describe('getContents', () => {
        it('should make an API call (GET) and store data', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _contents})
            await contentStore.getContents(false)
            expect(axiosPublic.get).toHaveBeenCalledOnce()
            expect(axiosPublic.get).toHaveBeenCalledWith('/contents/')
            expect(contentStore.contents).toEqual(_contents)
        })
    })

    describe('getContentsByCode', () => {
        it('should make an API call (GET) and store data', async () => {
            const codes: ContentCode[] = ['HOME_INFO']
            const contents = [_contents.find(obj => obj.code === codes[0])]
            mockedAxios.get.mockResolvedValueOnce({data: contents})
            await contentStore.getContentsByCode(codes)
            expect(axiosPublic.get).toHaveBeenCalledTimes(1)
            expect(axiosPublic.get).toHaveBeenCalledWith(`/contents/?code=${codes[0]}`)
            expect(contentStore.contents).toEqual(contents)
        })
    })

    describe('getLogos', () => {
        it('should make an API call (GET) and store data', async () => {
            mockedAxios.get.mockResolvedValueOnce({data: _logos})
            await contentStore.getLogos()
            expect(axiosPublic.get).toHaveBeenCalledTimes(1)
            expect(axiosPublic.get).toHaveBeenCalledWith('/contents/logos')
            expect(contentStore.logos).toEqual(_logos)
        })
    })
})
