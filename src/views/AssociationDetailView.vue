<script lang="ts" setup>
import {onBeforeMount} from 'vue'
import {useAssociationStore} from '@/stores/useAssociationStore'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useQuasar} from 'quasar'

const route = useRoute()
const {t} = useI18n()
const {notify} = useQuasar()

const associationStore = useAssociationStore()


// onMounted(getAssociation)
onBeforeMount(getAssociation)

async function getAssociation() {
    if (route.params.id) {
        try {
            const id = parseInt(route.params.id as string)
            await associationStore.getAssociationDetail(id)
        } catch (e) {
            notify({
                type: 'negative',
                message: t('notifications.negative.form-error')
            })
        }
    }
}
</script>

<template>
    <div class="title">
        <div class="logo">
            <img v-if="associationStore.association.pathLogo" :src="associationStore.association.pathLogo" alt=""/>
            <div v-else></div>
        </div>
        <div class="name">
            <h1>{{ associationStore.association.name }}</h1>
            <span>Charte valide jusqu'au XX/XX/XX</span>
        </div>
    </div>
    <div class="description">
        <p>{{ associationStore.association.description }}</p>
    </div>
    <div class="cardbox-title">
        <h2>Informations</h2>
        <div class="cardbox-item">
            <p>{{ associationStore.association.activities }}</p>
        </div>

        <div class="cardbox-item">
            <p>{{ associationStore.association.institution.name }}</p>
        </div>

        <div class="cardbox-item">
            <p>{{ associationStore.association.institutionComponent.name }}</p>
        </div>

        <div class="cardbox-item">
            <p>{{ associationStore.association.activityField.name }}</p>
        </div>

    </div>
    <!--<p>{{ associationStore.association.acronym }}</p>-->

    <div class="cardbox-title">
        <h2>Administration</h2>

        <div class="cardbox-item">
            <p>{{ associationStore.association.institution.name }}</p>
        </div>

    </div>

    <div class="cardbox-title">
        <h2>Contact</h2>
    </div>
</template>

<style lang="sass" scoped>
.title
    display: flex
    gap: 20px
    align-items: flex-start
    margin-top: 50px

    .name
        h1
            font-size: 5em
            line-height: 0

        span
            font-size: 2em

    .logo
        max-width: 150px
        width: 100%
        height: 150px
        background-color: grey

.description
    margin-top: 30px

h2
    background-color: $primary
    color: #fff
    font-size: 3em
    text-align: center
</style>