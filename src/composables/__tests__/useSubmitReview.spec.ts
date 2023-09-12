import {createTestingPinia} from '@pinia/testing'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {config} from '@vue/test-utils'
import {_axiosFixtures} from '~/fixtures/axios.mock'
import {createPinia, setActivePinia} from 'pinia'
import {useAxios} from '@/composables/useAxios'
import {useProjectStore} from '@/stores/useProjectStore'
import useSubmitReview from '@/composables/useSubmitReview'
import {_project, _projectReview} from '~/fixtures/project.mock'

vi.mock('@/composables/useAxios', () => ({
    useAxios: () => ({
        axiosPublic: _axiosFixtures,
        axiosAuthenticated: _axiosFixtures
    })
}))

vi.mock('@/composable/useUsers', () => ({
    default: () => ({
        initInfosToPatch: vi.fn(),
        updateUserInfos: vi.fn()
    })
}))

setActivePinia(createPinia())

let projectStore = useProjectStore()

config.global.plugins = [
    createTestingPinia({
        createSpy: vi.fn()
    })
]

describe('useSubmitReview', () => {
    beforeEach(() => {
        projectStore = useProjectStore()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        projectStore.project = undefined
    })

    const {
        patchProjectReview,
        projectReview,
        submitProjectReview
    } = useSubmitReview()
    const {axiosAuthenticated} = useAxios()

    const mockedAxios = vi.mocked(axiosAuthenticated, true)
    projectReview.value = _projectReview

    describe('patchProjectReview', () => {
        it('should patch modified fields of project review and update user infos', async () => {
            mockedAxios.patch.mockResolvedValueOnce({data: _projectReview})
            await patchProjectReview()
            const url = `/projects/${projectReview.value.id}/review`
            const data = {
                outcome: 300,
                income: 200,
                realStartDate: '2023-07-21T00:00:00.000Z',
                realEndDate: '2023-07-22T00:00:00.000Z',
                realLocation: 'Strasbourg',
                review: 'Everything went well.',
                impactStudents: 200,
                description: 'A project for students.',
                difficulties: 'The weather was hot.',
                improvements: 'Need more parasols and free water.',
            }
            expect(mockedAxios.patch).toHaveBeenCalledOnce()
            expect(mockedAxios.patch).toHaveBeenCalledWith(url, data)
        })
    })

    describe('submitProjectReview', () => {
        it('should patch the status of the project', async () => {
            projectStore.project = _project
            await submitProjectReview()
            const url = `/projects/${projectStore.project?.id}/status`
            expect(axiosAuthenticated.patch).toHaveBeenCalledOnce()
            expect(axiosAuthenticated.patch).toHaveBeenCalledWith(url, {projectStatus: 'PROJECT_REVIEW_PROCESSING'})
        })
    })
})
