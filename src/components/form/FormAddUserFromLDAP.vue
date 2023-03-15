<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {ref} from 'vue'
import {useQuasar} from 'quasar'
import {useI18n} from 'vue-i18n'

const {getUsersFromCAS, CASUsers} = useSecurity()
const {notify, loading} = useQuasar()
const {t} = useI18n()

const lastName = ref<string>('')

const open = ref<boolean>(false)

async function onGetUsersFromCAS() {
    if (lastName.value) {
        try {
            loading.show
            await getUsersFromCAS(lastName.value)
            loading.hide
            notify({
                type: 'positive',
                message: t('notifications.positive.get-cas-user-success')
            })
        } catch (error) {
            notify({
                type: 'negative',
                message: t('notifications.negative.cas-error')
            })
        }
    }
}
</script>

<template>
    <QBtn
        :label="t('dashboard.search-user-via-cas')"
        @click="open = true"
    />
    <QDialog
        v-model="open"
    >
        <QCard>
            <QCardSection>
                <QForm
                    class="q-gutter-md"
                    @submit.prevent="onGetUsersFromCAS"
                >
                    <fieldset v-if="CASUsers.length === 0">
                        <legend>{{ t('dashboard.search-user-via-cas') }}</legend>
                        <QInput
                            v-model="lastName"
                            :label="t('forms.last-name')"
                            :rules="[ val => val && val.length > 0 || t('forms.fill-field')]"
                            filled
                            lazy-rules
                        />
                        <div class="btn-group">
                            <QBtn :label="t('cancel')" color="primary" @click="open = false"/>
                            <QBtn :label="t('search')" color="primary" type="submit"/>
                        </div>
                    </fieldset>
                    <section v-else>
                        <p>Utilisateurs trouvés</p>
                        <ul>
                            <li v-for="(user, index) in CASUsers" :key="index">{{
                                    user.firstName + ' ' + user.lastName
                                }}
                            </li>
                        </ul>
                    </section>

                </QForm>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="sass">
@import "@/assets/styles/forms.scss"
</style>

<style lang="sass" scoped>
.btn-group
    display: flex
    gap: 5px

fieldset
    border: none
</style>