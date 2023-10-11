<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'

const {t} = useI18n()
const associationStore = useAssociationStore()
const {notify} = useQuasar()

const emit = defineEmits(['hasValidated'])

const isSite = ref<boolean>(false)
watch(() => associationStore.association, () => {
    isSite.value = associationStore.association?.isSite as boolean
})

const openAlert = ref<boolean>(false)

onMounted(() => {
    isSite.value = associationStore.association?.isSite as boolean
})


async function onChangeIsSite() {
    let positiveMessage = t('notifications.positive.enable-association-site')
    let negativeMessage = t('notifications.negative.enable-association-site-error')
    if (isSite.value) {
        positiveMessage = t('notifications.positive.disable-association-site')
        negativeMessage = t('notifications.negative.disable-association-site-error')
    }
    try {
        await associationStore.patchIsSite(!isSite.value as boolean, associationStore.association?.id)
        emit('hasValidated')
        notify({
            type: 'positive',
            message: positiveMessage
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: negativeMessage
        })
    }
}
</script>

<template>
    <QBtn
        :color="isSite ? 'custom-red' : 'association'"
        :icon="isSite ? 'bi-file-earmark-x-fill' : 'bi-file-earmark-check-fill'"
        :label="isSite ? t('association.disable-association-site') : t('association.enable-association-site')"
        class="btn-lg"
        @click="openAlert = true"
    />

    <QDialog
        v-model="openAlert"
        persistent
    >
        <QCard>
            <QCardSection class="row items-center">
                <p class="q-ml-sm">
                    {{
                        isSite ? t('association.confirm-disable-site') : t('association.confirm-enable-site')
                    }}
                </p>
                <div class="flex-row padding-top">
                    <QBtn
                        v-close-popup
                        :label="t('cancel')"
                        class="btn-lg"
                        color="association"
                        icon="bi-x-lg"
                    />
                    <QBtn
                        v-close-popup
                        :color="isSite ? 'custom-red' : 'association'"
                        :icon="isSite ? 'bi-file-earmark-x-fill' : 'bi-file-earmark-check-fill'"
                        :label="isSite ? t('association.disable-association-site') : t('association.enable-association-site')"
                        class="btn-lg"
                        @click="onChangeIsSite"
                    />
                </div>
            </QCardSection>
        </QCard>
    </QDialog>
</template>

<style lang="scss" scoped>
@import '@/assets/variables.scss';
</style>
