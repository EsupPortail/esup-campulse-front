import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useAxios} from '@/composables/useAxios'
import useProjectComments from '@/composables/useProjectComments'
import {_comments} from '~/fixtures/comments.mock'
import {useUserStore} from '../../stores/useUserStore'
import {_generalManager, _institutionManager} from '../../../tests/fixtures/user.mock'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composable/useUserAssociations', () => ({
    default: () => ({
        updateUserAssociations: vi.fn(),
        deleteUserAssociation: vi.fn(),
        getUserAssociations: vi.fn(),
        patchUserAssociations: vi.fn()
    })
}))

setActivePinia(createPinia())

let userStore = useUserStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useProjectComments', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        userStore.user = undefined
    })

    const {getProjectComments, comments, postNewProjectComment} = useProjectComments()
    const {axiosAuthenticated} = useAxios()
    const mockedAuthAxios = vi.mocked(axiosAuthenticated, true)

    describe('getProjectComments', () => {
        it('should get project comments', async () => {
            mockedAuthAxios.get.mockResolvedValueOnce({data: _comments})
            await getProjectComments(1)
            expect(axiosAuthenticated.get).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.get).toHaveBeenCalledWith('/projects/1/comments')
            expect(comments.value).toEqual(_comments)
        })
    })
    describe('postProjectComment', () => {
        it('should post new comment', async () => {
            userStore.user = _institutionManager
            await postNewProjectComment(1, 'Commentaire')
            expect(axiosAuthenticated.post).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.post).toHaveBeenCalledWith('/projects/comments', {
                project: 1,
                text: 'Commentaire',
                user: userStore?.user.id
            })
        })
    })
})
