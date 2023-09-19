<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import type {UserSearch} from '#/user'
import useUsers from '@/composables/useUsers'
import axios from 'axios'
import useErrors from '@/composables/useErrors'
import {useAssociationStore} from '@/stores/useAssociationStore'

const {t} = useI18n()
const userManagerStore = useUserManagerStore()
const {loading, notify} = useQuasar()
const {advancedSearch} = useUsers()
const {catchHTTPError} = useErrors()
const associationStore = useAssociationStore()


const emit = defineEmits(['advancedSearch', 'getUsers'])

const settings = ref<UserSearch>({
    search: '',
    firstName: '',
    lastName: '',
    email: '',
    association: null
})

const associations = ref(associationStore.associationLabels)

async function onGetAssociationNames() {
    try {
        await associationStore.getAssociationNames(false, false)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
}

onMounted(async () => {
    loading.show()
    await onGetAssociationNames()
    loading.hide()
})

function filterAssociations(val: string, update: (cb: () => void) => void) {
    update(() => {
        const lower = val.toLowerCase()
        associations.value = associationStore.associationLabels.filter(obj => obj.label.toLowerCase().indexOf(lower) > -1)
    })
}

async function onSearch() {
    loading.show()
    try {
        await userManagerStore.searchUsers(settings.value.search)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
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
            email: '',
            association: null
        }
        emit('getUsers')
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: catchHTTPError(error.response)
            })
        }
    }
    loading.hide()
}
</script>
<template>
    <section class="container flex-column padding-bottom">
        <h3>{{ t('user.search') }}</h3>
        <QForm
            id="search-form"
            :aria-label="t('user.directory')"
            class="search-text-field"
            role="search"
            @submit.prevent="onSearch"
        >
            <div>
                <QInput
                    v-model="settings.search"
                    :label="t('search')"
                    :placeholder="t('search')"
                    clearable
                    color="dashboard"
                    filled
                    inputmode="search"
                    lazy-rules
                >
                    <template v-slot:prepend>
                        <QIcon name="bi-search" />
                    </template>
                </QInput>
                <div class="flex-row padding-top">
                    <QBtn
                        :label="t('search')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-chevron-right"
                        type="submit"
                    />
                    <QBtn
                        :label="t('cancel-search')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-x-lg"
                        @click="clearSearch"
                    />
                </div>
            </div>
        </QForm>

        <QForm
            id="advanced-search-form"
            aria-label="t('user.directory-advanced')"
            role="search"
            @submit.prevent="emit('advancedSearch', advancedSearch(settings) ?? userManagerStore.users)"
        >
            <QExpansionItem
                :label="t('advanced-search')"
                header-class="text-dashboard"
            >
                <div class="flex-column">
                    <div class="flex-row">
                        <QInput
                            v-model="settings.firstName"
                            :label="t('user.first-name')"
                            class="full-width"
                            clearable
                            color="dashboard"
                            filled
                            lazy-rules
                        />
                        <QInput
                            v-model="settings.lastName"
                            :label="t('user.last-name')"
                            class="full-width"
                            clearable
                            color="dashboard"
                            filled
                            lazy-rules
                        />
                    </div>
                    <QInput
                        v-model="settings.email"
                        :label="t('user.email')"
                        clearable
                        color="dashboard"
                        filled
                        lazy-rules
                    />
                    <QSelect
                        v-model="settings.association"
                        :label="t('user.associations')"
                        :options="associations"
                        clearable
                        color="dashboard"
                        emit-value
                        filled
                        map-options
                        use-input
                        @filter="filterAssociations"
                    />
                </div>

                <div class="flex-row padding-top padding-bottom">
                    <QBtn
                        :label="t('advanced-search')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-chevron-right"
                        type="submit"
                    />
                    <QBtn
                        :label="t('cancel-search')"
                        class="btn-lg"
                        color="dashboard"
                        icon="bi-x-lg"
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
