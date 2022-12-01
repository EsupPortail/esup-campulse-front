import {afterEach, beforeEach, describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {Quasar} from 'quasar'
import i18n from '@/plugins/i18n'
import AlertAbortedCasRegistration from '@/components/alert/AlertAbortedCasRegistration.vue'
import {useUserStore} from '@/stores/useUserStore'
import {createPinia, setActivePinia} from 'pinia'
import {user} from '~/mocks/user.mock'
import type {User} from '#/user'


setActivePinia(createPinia())
let userStore = useUserStore()


describe('AlertAbortedCasRegistration', () => {
    beforeEach(() => {
        userStore = useUserStore()
        // by default, !isCas
        userStore.newUser = user
    })
    afterEach(() => {
        (userStore.newUser as User).isCas = false
    })
    it('should be visible if newUser isCas', () => {
        (userStore.newUser as User).isCas = true
        const wrapper = mount(AlertAbortedCasRegistration, {global: {plugins: [Quasar, i18n]}})
        expect(wrapper.find('.q-dialog').exists()).toBeTruthy()
    })
    it('should not be visible if newUser !isCas', () => {
        const wrapper = mount(AlertAbortedCasRegistration, {global: {plugins: [Quasar, i18n]}})
        expect(wrapper.find('.q-dialog').exists()).toBeFalsy()
    })
})
