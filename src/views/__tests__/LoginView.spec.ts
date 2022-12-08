import {beforeEach, describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {Quasar} from 'quasar'
import i18n from '@/plugins/i18n'
// @ts-ignore view is imported
import LoginView from '@/views/LoginView.vue'
import {useUserStore} from '@/stores/useUserStore'
import {createPinia, setActivePinia} from 'pinia'
import {user} from '~/mocks/user.mock'


setActivePinia(createPinia())
let userStore = useUserStore()


describe('LoginView', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })
    describe('If newUser is undefined', () => {
        it('should display CAS login', () => {
            const wrapper = mount(LoginView, {global: {plugins: [Quasar, i18n]}})
            expect(wrapper.find('#cas-login').exists()).toBeTruthy()
        })
        it('should display local login', () => {
            const wrapper = mount(LoginView, {global: {plugins: [Quasar, i18n]}})
            expect(wrapper.find('#local-login').exists()).toBeTruthy()
        })
        it('should not display aborted cas registration', () => {
            const wrapper = mount(LoginView, {global: {plugins: [Quasar, i18n]}})
            expect(wrapper.find('#aborted-cas-registration').exists()).toBeFalsy()
        })
    })
    describe('If newUser exists and isCas', () => {
        beforeEach(() => {
            userStore.newUser = user
            userStore.newUser.isCas = true
        })
        it('should not display CAS login', () => {
            const wrapper = mount(LoginView, {global: {plugins: [Quasar, i18n]}})
            expect(wrapper.find('#cas-login').exists()).toBeFalsy()
        })
        it('should not display local login', () => {
            const wrapper = mount(LoginView, {global: {plugins: [Quasar, i18n]}})
            expect(wrapper.find('#local-login').exists()).toBeFalsy()
        })
        it('should display aborted cas registration', () => {
            const wrapper = mount(LoginView, {global: {plugins: [Quasar, i18n]}})
            expect(wrapper.find('#aborted-cas-registration').exists()).toBeTruthy()
        })
    })
})
