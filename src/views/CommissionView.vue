<script lang="ts" setup>
import useUserGroups from '@/composables/useUserGroups'
import useSecurity from '@/composables/useSecurity'
import {useUserStore} from '@/stores/useUserStore'
import {onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'

const {hasPerm} = useSecurity()
const userStore = useUserStore()
const {initGroupPermToJoinAssociation, groupCanJoinAssociation} = useUserGroups()
const {t} = useI18n()

const isLoaded = ref<boolean>(false)

onMounted(() => {
    if (userStore.user) {
        const groupArray = userStore.user.groups.map(group => group.groupId)
        initGroupPermToJoinAssociation(groupArray)
        isLoaded.value = true
    }
})

</script>

<template>
    <section class="dashboard-section">
        <div class="form-container">
            <div class="form">
                <QBtn
                    v-if="isLoaded && hasPerm('add_project') && !groupCanJoinAssociation"
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
