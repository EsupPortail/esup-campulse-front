<script lang="ts" setup>
import FormProfilePasswordEdit from '@/components/form/FormProfilePasswordEdit.vue'
import {useI18n} from 'vue-i18n'
import FormUserInfosEdition from '@/components/form/FormUserInfosEdition.vue'
import {useUserStore} from '@/stores/useUserStore'
import FormUpdateUserAssociations from '@/components/form/FormUpdateUserAssociations.vue'
import {ref} from 'vue'
import useUserGroups from '@/composables/useUserGroups'

const {t} = useI18n()
const userStore = useUserStore()
const {isStaff} = useUserGroups()

const tab = ref<string>('infos')

</script>

<template>
    <div class="container">
        <QTabs
            v-model="tab"
            active-color="primary"
            dense
            indicator-color="primary"
            narrow-indicator
        >
            <QTab :label="t('dashboard.my-infos')" name="infos"/>
            <QTab
                v-if="!isStaff"
                :label="t('dashboard.my-associations')"
                name="associations"
            />
            <QTab
                v-if="!userStore.user?.isCas"
                :label="t('dashboard.my-password')"
                name="password"
            />
        </QTabs>

        <QTabPanels v-model="tab" animated>
            <QTabPanel name="infos">
                <FormUserInfosEdition :edited-by-staff="false" :user="userStore.user"/>
            </QTabPanel>

            <QTabPanel name="associations">
                <FormUpdateUserAssociations :edited-by-staff="false" :user="userStore.user"/>
            </QTabPanel>

            <QTabPanel name="password">
                <FormProfilePasswordEdit/>
            </QTabPanel>
        </QTabPanels>
    </div>
</template>

<style lang="sass" scoped>
.container
    max-width: 1280px
    width: 100%
    margin: auto
</style>
