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
        class="association-card"
    >
        <QCardSection>
            <section id="association-user-update">
                <h4 class="title-3">{{ association.name }}</h4>
                <QOptionGroup
                    v-model="association.role"
                    :options="association.options"
                    color="teal"
                />
                <div class="btn-group btn-delete">
                    <div>
                        <QBtn
                            v-if="!association.deleteAssociation"
                            :label="t('dashboard.association-user.delete-association')"
                            color="delete"
                            icon="bi-trash"
                            @click="association.deleteAssociation = true"
                        />
                        <div v-else>
                            <div class="cancel-delete">
                                <QBtn
                                    :label="t('cancel-delete')"
                                    icon="bi-x-lg"
                                    @click="association.deleteAssociation = false"
                                />
                                <span class="delete-message">
                                    {{ t('user.delete-association-role') }}
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
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';

.q-card {
    padding: 1rem;
}
</style>
