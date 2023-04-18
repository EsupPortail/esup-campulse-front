<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {onMounted} from 'vue'
import useUserAssociations from '@/composables/useUserAssociations'
import {useUserManagerStore} from '@/stores/useUserManagerStore'

const {t} = useI18n()
const {notify, loading} = useQuasar()
const {
    userAssociations,
    getUserAssociations,
    initUserAssociations
} = useUserAssociations()
const userManagerStore = useUserManagerStore()

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
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.form-error')
        })
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
                <h4 class="title-4">{{ association.name }}</h4>
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
                            icon="mdi-delete"
                            @click="association.deleteAssociation = true"
                        />
                        <div v-else>
                            <div class="cancel-delete">
                                <QBtn
                                    :label="t('cancel-delete')"
                                    icon="mdi-cancel"
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

<style lang="scss">
@import '@/assets/styles/forms.scss';
@import '@/assets/styles/associations.scss';
</style>
