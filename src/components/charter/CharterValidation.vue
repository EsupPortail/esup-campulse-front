<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {DocumentProcessType} from '#/documents'
import {useAssociationStore} from '@/stores/useAssociationStore'
import useCharters from '@/composables/useCharters'
import ListDocumentCharter from '@/components/documents/ListDocumentCharter.vue'

const {t} = useI18n()
const associationStore = useAssociationStore()
const {charterDocuments} = useCharters()

const emit = defineEmits(['closeDialog'])

const props = defineProps<{
    processType: DocumentProcessType,
    association: number,
    charter: number
}>()

</script>

<template>
    <QForm
        class="flex-column"
        @submit=""
    >
        <h3>{{ associationStore.associations.find(obj => obj.id === props.association)?.name }}</h3>

        <ListDocumentCharter
            :charter-documents="charterDocuments.filter(docs => docs.document === props.charter && docs.association === props.association)"
        />

        <!--                    <QSelect
                                v-if="selectedAction !== 'return'"
                                v-model="selectedProjectCommissionFunds"
                                :label="t('project.commission-funds-validation',
                                          {action: `${selectedAction === 'validate' ? 'valider' : 'refuser'}`}) + ' (' + t('required') + ')'"
                                :options="projectCommissionFundLabels"
                                :rules="[val => val && val.length || t('forms.required-fund')]"
                                aria-required="true"
                                clearable
                                color="commission"
                                emit-value
                                filled
                                map-options
                                multiple
                                reactive-rules
                                use-chips
                            />
                            <QInput
                                v-model="newComment"
                                :aria-required="selectedAction !== 'validate'"
                                :hint="selectedAction !== 'validate' ? t('forms.project-comment-hint') : ''"
                                :label="t('forms.comment') + (selectedAction !== 'validate' ? ` (${t('required')})` : ` (${t('optional')})`)"
                                :rules="selectedAction !== 'validate' ? [ val => val && val.length > 0 || t('forms.required-comment')] : []"
                                color="commission"
                                filled
                                lazy-rules
                                type="textarea"
                            />-->
        <div class="flex-column padding-top">
            <QBtn
                :label="t('charter.actions.validate')"
                class="btn-lg"
                color="charter"
                icon="bi-check-lg"
                text-color="charter"
                type="submit"
            />
            <QBtn
                :label="t('charter.actions.return')"
                class="btn-lg"
                color="custom-red"
                icon="bi-exclamation-triangle"
                type="submit"
            />
            <QBtn
                :label="t('charter.actions.reject')"
                class="btn-lg"
                color="custom-red"
                icon="bi-x-octagon"
                type="submit"
            />
            <QBtn
                :label="t('back')"
                class="btn-lg"
                color="charter"
                icon="bi-box-arrow-left"
                text-color="charter"
                @click="emit('closeDialog')"
            />
        </div>
    </QForm>
</template>