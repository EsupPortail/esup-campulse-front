<script lang="ts" setup>
import FormProfilePasswordEdit from '@/components/form/FormProfilePasswordEdit.vue'
import {useI18n} from 'vue-i18n'
import FormUserInfosEdition from '@/components/form/FormUserInfosEdition.vue'
import {useUserStore} from '@/stores/useUserStore'
import FormUpdateUserAssociations from '@/components/form/FormUpdateUserAssociations.vue'
import {ref} from 'vue'

const {t} = useI18n()
const userStore = useUserStore()

const tab = ref<string>('')

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
            <QTab label="Mes informations" name="infos"/>
            <QTab v-if="userStore.user?.associations.length !== 0" label="Mes associations" name="associations"/>
            <QTab v-if="!userStore.user?.isCas" label="Mot de passe" name="password"/>
        </QTabs>

        <QTabPanels v-model="tab" animated>
            <QTabPanel name="infos">
                <FormUserInfosEdition :edited-by-staff="false" :user="userStore.user"/>
            </QTabPanel>

            <QTabPanel name="associations">
                <FormUpdateUserAssociations :edited-by-staff="false"/>
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
