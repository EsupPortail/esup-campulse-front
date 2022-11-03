import { describe, it, expect } from 'vitest'
import { config, mount } from '@vue/test-utils'
import i18n from '@/plugins/i18n'
import { Quasar } from 'quasar'
import LayoutHomeBanner from '../layout/LayoutHomeBanner.vue'

// Set mount options
config.global.plugins = [
    i18n,
    Quasar,
]

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
