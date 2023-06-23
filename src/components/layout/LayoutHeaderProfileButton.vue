<script lang="ts" setup>
import {useUserStore} from '@/stores/useUserStore'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import router from '@/router'
import {onMounted} from 'vue'
import useUserAssociations from '@/composables/useUserAssociations'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const userStore = useUserStore()
const {t} = useI18n()
const {notify, loading} = useQuasar()
const {getUserAssociations} = useUserAssociations()
const {catchHTTPError} = useErrors()

async function onLogOut() {
    loading.show()
    try {
        userStore.logOut()
        await router.push({name: 'Login'})
        notify({
            type: 'positive',
            message: t('notifications.positive.logout-success')
        })
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

onMounted(async () => {
    loading.show()
    if (userStore.user?.associations.length !== 0) await getUserAssociations(userStore.user?.id as number, false)
    loading.hide()
})

</script>

<template>
    <div class="q-pa-md">
        <QBtnDropdown
            :menu-offset="[0, 8]"
            align="between"
            content-class="profile-menu"
            no-caps
            padding="0"
        >
            <template v-slot:label>
                <div class="row items-center no-wrap">
                    <div
                        aria-hidden="true"
                        class="avatar"
                    >
                        <i class="bi bi-person-circle"></i>
                    </div>

                    <div class="text-center">
                        <p>{{ t('header.my-account') }}</p>
                    </div>
                </div>
            </template>

            <QList>
                <div>
                    <QItem
                        v-close-popup
                        clickable
                        @click="router.push({ name: 'Dashboard' })"
                    >
                        <QItemSection>
                            <QItemLabel>{{ t('header.my-profile') }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                </div>

                <div
                    v-for="(item) in userStore.userAssociations"
                    :key="item.id"
                >
                    <QItem
                        v-if="item.isValidatedByAdmin"
                        v-close-popup
                        clickable
                        @click="router.push({ name: 'AssociationDashboard', params: { id: item.association.id } })"
                    >
                        <QItemSection>
                            <QItemLabel>{{ item.association.name }}</QItemLabel>
                        </QItemSection>
                    </QItem>
                </div>

                <QItem
                    v-close-popup
                    clickable
                    @click="onLogOut"
                >
                    <QItemSection>
                        <QItemLabel>{{ t('header.logout') }}</QItemLabel>
                    </QItemSection>
                </QItem>
            </QList>
        </QBtnDropdown>
    </div>
</template>
