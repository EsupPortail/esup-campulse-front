<script lang="ts" setup>
import { useUserStore } from '@/stores/useUserStore'
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import router from "@/router";

const userStore = useUserStore()
const { t } = useI18n()
const { notify } = useQuasar()


async function onLogOut() {
    await userStore.logOut()
    await router.push({ name: 'Login' })
    notify({
        type: 'positive',
        message: t('notifications.positive.logout-success')
    })
}
</script>

<template>
    <div class="q-pa-md">
        <QBtnDropdown align="between" color="secondary" no-caps padding="0">
            <template v-slot:label>
                <div class="row items-center no-wrap">

                    <div class="avatar">
                        <QAvatar color="primary" size="2em" text-color="white">{{
                            userStore.userNameFirstLetter
                        }}
                        </QAvatar>
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
p
    font-size: 1.3em
    margin: 0

.avatar
    padding: 0.3em
    margin-right: 0.3em

.user-avatar
    width: 32px
    height: 32px
    border-radius: 50%
    border: 2px solid #fff
    position: relative
    margin-left: 5px

.user-avatar span
    position: absolute
    text-align: center
    font-size: 30px
    line-height: 0
    top: 15px
    left: 6px

.label
    color: black
    text-decoration: none

.label:hover
    background-color: rgba(255, 255, 255, 0.3)
</style>
