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
    loading.show
    await onGetUserAssociations()
    loading.hide
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
            <section>
                <h4>{{ association.name }}</h4>
                <QOptionGroup
                    v-model="association.role"
                    :options="association.options"
                    color="primary"
                />
                <div class="btn-group">
                    <div>
                        <QBtn
                            v-if="!association.deleteAssociation"
                            :label="t('dashboard.association-user.delete-association')"
                            color="red"
                            icon="mdi-delete"
                            @click="association.deleteAssociation = true"
                        />
                        <div v-else>
                            <span class="delete-message">
                                {{ t('user.delete-association-role') }}
                            </span>
                            <QBtn
                                :label="t('cancel-delete')"
                                icon="mdi-cancel"
                                outline
                                @click="association.deleteAssociation = false"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </QCardSection>
    </QCard>
</template>

<style lang="sass">
@import '@/assets/styles/forms.scss'
</style>

<style lang="sass" scoped>
.form
    display: flex
    flex-direction: column
    gap: 1rem

.association-card
    padding: 1rem

fieldset
    border: none

fieldset .q-checkbox
    width: 100%

h4
    font-size: 1.5em
    padding: 0
    line-height: 0

.delete-message
    color: red

.btn-group
    display: flex
    gap: 1rem
    margin-top: 1rem

ul
    padding: 1rem
    margin-top: 1rem
</style>
