<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from "vue-i18n";
import {useQuasar} from "quasar";
import router from "@/router";

const userStore = useUserStore()
const {t} = useI18n()
const {notify} = useQuasar()


async function onLogOut() {
    await userStore.logOut()
    await router.push({name: 'Login'})
    notify({
        type: 'positive',
        message: t('notifications.positive.logout-success')
    })
}
</script>

<template>
    <div class="q-pa-md">
        <QBtnDropdown :menu-offset="[0, 8]" align="between" color="secondary" content-class="profile-menu" no-caps
                      padding="0">
            <template v-slot:label>
                <div class="row items-center no-wrap">

                    <div class="avatar">
                        <i class="bi bi-person-circle"></i>
                    </div>

                    <div class="text-center">
                        <p>{{ t("header.my-account") }}</p>
                    </div>

                </div>
            </template>

            <QList>
                <QItem v-close-popup clickable @click="router.push({ name: 'Dashboard' })">
                    <QItemSection>
                        <QItemLabel>{{ t("header.my-profile") }}</QItemLabel>
                    </QItemSection>
                </QItem>

                <QItem v-for="(item) in userStore.user?.associations" :key="item.id" v-close-popup clickable
                       @click="router.push({ name: 'AssociationDashboard', params: { id: item.id } })">
                    <QItemSection>
                        <QItemLabel>{{ item.name }}</QItemLabel>
                    </QItemSection>
                </QItem>

                <QItem v-close-popup clickable @click="onLogOut">
                    <QItemSection>
                        <QItemLabel>{{ t('header.logout') }}</QItemLabel>
                    </QItemSection>
                </QItem>
            </QList>
        </QBtnDropdown>
    </div>
</template>

<style lang="sass" scoped>
.q-list
    color: white
</style>
