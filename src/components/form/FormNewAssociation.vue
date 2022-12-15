<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'
import {ref} from 'vue'
import useAssociation from "@/composables/useAssociation";
import router from "@/router";

const {t} = useI18n()
const {notify} = useQuasar()

const {createAssociation} = useAssociation();
const newAssociation = ref<string>('')

async function onCreate() {
    try {
        await createAssociation(newAssociation.value)
        await router.push({name: 'Dashboard'})
        notify({
            type: 'positive',
            message: t('notifications.positive.validate-asso')
        })
    } catch (e) {
        notify({
            type: 'negative',
            message: t('notifications.negative.error-asso')
        })
    }
}
</script>

<template>
    <QForm
        class="q-gutter-md"
        @submit.prevent="onCreate"
    >
        <h3>{{ t("association.labels.new-asso") }}</h3>
        <QInput
            v-model="newAssociation"
            :label="t('forms.name')"
            filled
            lazy-rules
        />
        <section class="btn-group">
            <QBtn
                :label="t('home.back-dashboard')"
                color="secondary"
                icon="mdi-arrow-left-circle"
                to="/associations"
            />
            <QBtn
                :label="t('manager.validate')"
                color="primary"
                @:click="onCreate"
            />
        </section>
    </QForm>
</template>

<style lang="sass" scoped>
h2
    background-color: $primary
    color: #fff
    font-size: 2em
    text-align: center

article > *
    margin: 0
    width: 50%

article
    display: flex
    align-items: center
    background-color: lightgrey
    padding: 0 20px 0 20px
    margin: 5px 0

h3
    font-size: 1.2em
    text-transform: uppercase

.btn-group
    display: flex
    gap: 10px

</style>