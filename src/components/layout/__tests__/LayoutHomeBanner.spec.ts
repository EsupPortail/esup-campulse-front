import {describe, it, expect} from 'vitest'
import {mount} from '@vue/test-utils'
import LayoutHomeBanner from '@/components/layout/LayoutHomeBanner.vue'

describe('LayoutHomeBanner', () => {
    it('should be visible if isDisplayed is true', () => {
        const wrapper = mount(LayoutHomeBanner, { props: { is_displayed: true } })
        expect(wrapper.find('q-banner').exists()).toBeTruthy()
    })

    it('should not be visible if isDisplayed is false', () => {
        const wrapper = mount(LayoutHomeBanner, { props: { is_displayed: false } })
        expect(wrapper.find('q-banner').exists()).not.toBeTruthy()
    })
})