<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {UserSearch} from '#/user'
import useUsers from '@/composables/useUsers'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const userManagerStore = useUserManagerStore()
const {loading, notify} = useQuasar()
const {advancedSearch} = useUsers()
const {catchHTTPError} = useErrors()


const emit = defineEmits(['advancedSearch', 'getUsers'])

const settings = ref<UserSearch>({
    search: '',
    firstName: '',
    lastName: '',
    email: ''
})

async function onSearch() {
    loading.show()
    try {
        await userManagerStore.searchUsers(settings.value.search)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}

// A function that clears the search,
// for API search it re-gets associations, for front search it looks back in store
async function clearSearch() {
    loading.show()
    try {
        settings.value = {
            search: '',
            firstName: '',
            lastName: '',
            email: ''
        }
        emit('getUsers')
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
    loading.hide()
}
</script>
<template>
    <section class="directory-search">
        <h3 class="title-3">{{ t('user.search') }}</h3>
        <QForm
                id="search-form"
                class="search-text-field"
                @submit.prevent="onSearch"
        >
            <fieldset>
                <QInput
                        v-model="settings.search"
                        :label="t('search')"
                        :placeholder="t('search')"
                        clearable
                        filled
                        inputmode="search"
                        lazy-rules
                >
                    <template v-slot:prepend>
                        <QIcon name="mdi-magnify"/>
                    </template>
                </QInput>
                <QBtn
                        :label="t('search')"
                        class="search-button"
                        color="primary"
                        icon-right="mdi-chevron-right"
                        type="submit"
                />
                <QBtn
                        :label="t('cancel-search')"
                        color="secondary"
                        icon-right="mdi-close"
                        @click="clearSearch"
                />
            </fieldset>
        </QForm>

        <QForm
                id="advanced-search-form"
                class="search-text-field"
                @submit.prevent="emit('advancedSearch', advancedSearch(settings) ?? userManagerStore.users)"
        >
            <QExpansionItem
                    :label="t('advanced-search')"
                    expand-separator
                    icon="bi-chevron-compact-right"
            >
                <fieldset>
                    <QInput
                            v-model="settings.firstName"
                            :label="t('user.first-name')"
                            clearable
                            filled
                            lazy-rules
                    />
                    <QInput
                            v-model="settings.lastName"
                            :label="t('user.last-name')"
                            clearable
                            filled
                            lazy-rules
                    />
                    <QInput
                            v-model="settings.email"
                            :label="t('user.email')"
                            class="full-size"
                            clearable
                            filled
                            lazy-rules
                    />
                </fieldset>

                <div class="btn-group">
                    <QBtn
                            :label="t('advanced-search')"
                            class="search-button"
                            color="primary"
                            icon-right="mdi-chevron-right"
                            type="submit"
                    />
                    <QBtn
                            :label="t('cancel-search')"
                            color="secondary"
                            icon-right="mdi-close"
                            @click="clearSearch"
                    />
                </div>
            </QExpansionItem>
        </QForm>
    </section>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';

</style>
