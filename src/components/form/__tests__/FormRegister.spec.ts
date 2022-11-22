import {describe, it, expect, beforeEach, afterEach} from 'vitest'
import {tokens} from '~/mocks/tokens.mock'
import {mockedAxios} from '~/mocks/axios.mock'
import {newUser, user, userAssociations, newUserGroups} from '~/mocks/user.mock'
import * as userService from '@/services/userService'
import type {AxiosResponse} from 'axios'
import {useUserStore} from '@/stores/useUserStore'
import {createPinia, setActivePinia} from 'pinia'
import { useRoute } from 'vue-router'

// loadCASUser
// loadAssociations
// loadGroups

// disables inputs if CAS
// does a lot of things with adding and removing associations


setActivePinia(createPinia())
let userStore = useUserStore()
const route = useRoute()

describe('Load CAS User', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })
    /*afterEach(() => {
        mockedAxios.post.mockRestore()
    })*/
    // it should not execute without ticket
    it('should not execute without ticket', () => {
        const ticket = route.query.ticket

    })
    // it should display CAS user infos in form
    // it should disable certain inputs
})

