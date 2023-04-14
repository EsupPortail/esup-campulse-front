<script lang="ts" setup>
import useSecurity from '@/composables/useSecurity'
import {useI18n} from 'vue-i18n'

const {hasPerm} = useSecurity()
const {t} = useI18n()

</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <QBtn
                    v-if="hasPerm('add_project_user')"
                    :label="t('project.submit-new-project')"
                    :to="{name: 'SubmitProjectIndividual'}"
                />
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@import '@/assets/styles/forms.scss';
</style>
