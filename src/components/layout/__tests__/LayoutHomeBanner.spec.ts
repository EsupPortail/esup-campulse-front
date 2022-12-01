import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {Quasar} from 'quasar'
// @ts-ignore import component
import LayoutHomeBanner from '@/components/layout/LayoutHomeBanner.vue'


describe('LayoutHomeBanner', () => {
    it('should be visible if isDisplayed is true', () => {
        const wrapper = mount(LayoutHomeBanner, {global: {plugins: [Quasar]}, props: {isDisplayed: true}})
        expect(wrapper.find('.q-banner').exists()).toBeTruthy()
    })

    it('should not be visible if isDisplayed is false', () => {
        const wrapper = mount(LayoutHomeBanner, {global: {plugins: [Quasar]}, props: {isDisplayed: false}})
        expect(wrapper.find('.q-banner').exists()).toBeFalsy()
    })
})
