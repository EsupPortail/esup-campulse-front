<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import useUserAssociations from '@/composables/useUserAssociations'
import {useUserManagerStore} from '@/stores/useUserManagerStore'
import axios from 'axios'
import useErrors from '@/composables/useErrors'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {
    userAssociations,
    getUserAssociations,
    initUserAssociations
} = useUserAssociations()
const userManagerStore = useUserManagerStore()
const {catchHTTPError} = useErrors()

onMounted(async () => {
    loading.show()
    await onGetUserAssociations()
    loading.hide()
})

// Load userAssociations
async function onGetUserAssociations() {
    try {
        await getUserAssociations(userManagerStore.user?.id as number, true)
        initUserAssociations(true)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            notify({
                type: 'negative',
                message: t(`notifications.negative.${catchHTTPError(error.response.status)}`)
            })
        }
    }
}
</script>

<template>
    <p v-if="userAssociations.length === 0">
        {{
            t('user.has-no-association')
        }}
    </p>
    <QCard
        v-for="association in userAssociations"
        :key="association.id ? association.id : 0"
    >
        <QCardSection>
            <section>
                <h3>{{ association.name }}</h3>
                <QOptionGroup
                    v-model="association.role"
                    :aria-label="t('forms.association-role')"
                    :disable="association.deleteAssociation"
                    :options="association.options"
                    color="dashboard"
                />
                <div class="flex-row">
                    <div>
                        <QBtn
                            v-if="!association.deleteAssociation"
                            :label="t('dashboard.association-user.delete-association')"
                            class="btn-lg"
                            color="custom-red"
                            icon="bi-trash"
                            outline
                            @click="association.deleteAssociation = true"
                        />
                        <div v-else>
                            <div class="flex-row">
                                <QBtn
                                    :label="t('cancel-delete')"
                                    class="btn-lg"
                                    color="custom-red"
                                    icon="bi-x-lg"
                                    outline
                                    @click="association.deleteAssociation = false"
                                />
                                <span><em>
                                    {{ t('user.delete-association-role') }}
                                </em>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </QCardSection>
    </QCard>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
</style>
