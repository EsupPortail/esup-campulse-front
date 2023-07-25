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
                flat
                no-caps
                padding="0"
        >
            <template v-slot:label>
                <span class="row items-center no-wrap">
                    <span
                            aria-hidden="true"
                            class="avatar"
                    >
                        <i class="bi bi-person-circle"></i>
                    </span>
                    <span class="text-center">{{ t('header.my-account') }}</span>
                </span>
            </template>

            <QList>
                <ul>
                    <li>
                        <QItem
                                v-close-popup
                                clickable
                                @click="router.push({ name: 'Dashboard' })"
                        >
                            <QItemSection>
                                <QItemLabel>{{ t('header.my-profile') }}</QItemLabel>
                            </QItemSection>
                        </QItem>
                    </li>

                    <li
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
                    </li>

                    <li>
                        <QItem
                                v-close-popup
                                clickable
                                @click="onLogOut"
                        >
                            <QItemSection>
                                <QItemLabel>{{ t('header.logout') }}</QItemLabel>
                            </QItemSection>
                        </QItem>
                    </li>
                </ul>
            </QList>
        </QBtnDropdown>
    </div>
</template>

<style lang="scss" scoped>
.q-btn-dropdown {
  font-size: 1.8rem;
}

.q-list {
  max-width: 30rem;
  width: 100%;
}

.q-btn__content > span > * {
  padding: 0 0.5rem;
}

p {
  margin-bottom: 0 !important;
}

ul {
  padding-left: 0;
}

li {
  list-style-type: none;
}
</style>
