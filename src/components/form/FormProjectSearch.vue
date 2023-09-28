<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {ref} from 'vue'
// import useManageProjects from '@/composables/useManageProjects'
// import {useQuasar} from 'quasar'
// import axios from 'axios'
// import useErrors from '@/composables/useErrors'
import {useProjectStore} from '@/stores/useProjectStore'

const {t} = useI18n()
// const {loading, notify} = useQuasar()
// const {catchHTTPError} = useErrors()
const projectStore = useProjectStore()

const emit = defineEmits(['onClearSearch'])

const manualIdentifier = ref('')

function onClearSearch() {
    manualIdentifier.value = ''
    emit('onClearSearch')
}
</script>

<template>
    <QForm
        id="search-form"
        :aria-label="t('project.project', 2)"
        class="search-text-field"
        role="search"
        @submit="projectStore.searchProjectByManualIdentifier(manualIdentifier)"
    >
        <QInput
            v-model="manualIdentifier"
            :label="t('search')"
            :placeholder="t('search')"
            clearable
            color="commission"
            filled
            inputmode="search"
            lazy-rules
        >
            <template v-slot:prepend>
                <QIcon name="bi-search"/>
            </template>
        </QInput>
        <div class="flex-row padding-top">
            <QBtn
                :label="t('search')"
                class="btn-lg"
                color="commission"
                icon="bi-chevron-right"
                type="submit"
            />
            <QBtn
                :label="t('cancel-search')"
                class="btn-lg"
                color="commission"
                icon="bi-x-lg"
                @click="onClearSearch"
            />
        </div>
    </QForm>
</template>