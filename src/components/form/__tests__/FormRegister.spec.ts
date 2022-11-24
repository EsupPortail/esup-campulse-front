import {describe, it, expect, beforeEach} from 'vitest'
import {config, mount} from '@vue/test-utils'
import {useUserStore} from '@/stores/useUserStore'
import {createPinia, setActivePinia} from 'pinia'
import FormRegister from '@/components/form/FormRegister.vue'
import {Quasar} from 'quasar'
import i18n from '@/plugins/i18n'
import { nextTick } from 'vue'


/*// does a lot of things with adding and removing associations
setActivePinia(createPinia())
let userStore = useUserStore()

// Set mount options
config.global.plugins = [
    i18n,
    Quasar,
]

describe('Form register', () => {
    beforeEach(() => {
        userStore = useUserStore()
    })
    describe('Add new association should ', () => {
        it('should add a new fieldset', async () => {
            const wrapper = mount(FormRegister)
            const addAssociation = wrapper.find('.q-btn[label="$t(\'forms.add-association\')"]')
            await addAssociation.trigger('click')
            await nextTick()
            const updateModelValue = wrapper.emitted('update:modelValue')
            expect(updateModelValue).toHaveLength(1)
        })
    })
})*/



