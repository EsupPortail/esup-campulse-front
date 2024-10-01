<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import axios from 'axios'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useErrors'
import {onMounted} from 'vue'

const {t} = useI18n()
const {loading, notify} = useQuasar()
const associationStore = useAssociationStore()
const {catchHTTPError} = useErrors()

const props = defineProps<{
    association: number | undefined
}>()

onMounted(async () => {
    loading.show()
    await onGetAssociationDetails()
    loading.hide()
})

async function onGetAssociationDetails() {
    if (props.association) {
        try {
            await associationStore.getAssociationDetail(props.association, false)
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                notify({
                    type: 'negative',
                    message: await catchHTTPError(error.response)
                })
            }
        }
    }
}
</script>

<template>
    <div class="flex-column padding-top padding-bottom">
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.name') }}</p>
            <p>{{ associationStore.association?.name }}</p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.acronym') }}</p>
            <p>{{ associationStore.association?.acronym }}</p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.last-goa') }}</p>
            <p>{{ associationStore.association?.lastGoaDate?.split('-').reverse().join('/') }}</p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.president-name') }}</p>
            <p>{{ associationStore.association?.presidentNames }}</p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.president-phone') }}</p>
            <p>{{ associationStore.association?.presidentPhone }}</p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.president-email') }}</p>
            <p>{{ associationStore.association?.presidentEmail }}</p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.institution-component') }}</p>
            <p>
                {{
                    associationStore.institutionComponentLabels.find(obj => obj.value ===
                        associationStore.association?.institutionComponent)?.label
                }}
            </p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.activity-field') }}</p>
            <p>
                {{
                    associationStore.activityFieldLabels.find(obj => obj.value ===
                        associationStore.association?.activityField)?.label
                }}
            </p>
        </div>
        <div class="display-row">
            <p class="row-title">{{ t('association.labels.address') }}</p>
            <p>
                {{ associationStore.association?.address }}<br/>
                {{ associationStore.association?.zipcode + ' ' + associationStore.association?.city }}<br/>
                {{ associationStore.association?.country }}
            </p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/forms.scss";
@import "@/assets/styles/dashboard.scss";
</style>
