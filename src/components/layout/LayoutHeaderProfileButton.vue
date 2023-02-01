<script lang="ts" setup>
import {RouterLink} from 'vue-router'
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
        <QBtnDropdown align="between" color="secondary" no-caps padding="0">
            <template v-slot:label>
                <div class="row items-center no-wrap">

                    <div class="avatar">
                        <i class="bi bi-person-circle"></i>
                        <!-- <QAvatar color="primary" size="2em" text-color="white">{{
                                userStore.userNameFirstLetter
                            }}
                        </QAvatar> -->
                    </div>

                    <div class="text-center">
                        <p>{{ t("header.my-account") }}</p>
                    </div>

                </div>
            </template>

            <QList id="profile-menu">
                <QItem v-close-popup clickable>
                    <QItemSection>
                        <QItemLabel>
                            <RouterLink :to="{name: 'Dashboard'}" class="label">{{
                                    t("header.my-profile")
                                }}
                            </RouterLink>
                        </QItemLabel>
                    </QItemSection>
                </QItem>

                <QItem v-close-popup clickable>
                    <QItemSection>
                        <QItemLabel>
                            <QBtn :label="t('header.logout')" @click="onLogOut"/>
                        </QItemLabel>
                    </QItemSection>
                </QItem>
            </QList>
        </QBtnDropdown>
    </div>
</template>
