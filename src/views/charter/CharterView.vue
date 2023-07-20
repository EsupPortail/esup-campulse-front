<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import LayoutPageCards from '@/components/layout/LayoutPageCards.vue'
import type {PageCard} from '#/index'
import useUserGroups from '@/composables/useUserGroups'
import {onMounted, ref} from 'vue'
import useSecurity from '@/composables/useSecurity'


const {isStaff} = useUserGroups()
const {hasPerm} = useSecurity()

const pageCards = ref<PageCard[]>([])

const initPageCards = () => {
    if (isStaff.value) { // todo : ajouter bonne permission
        pageCards.value.push({
            to: {name: 'ManageCharters'},
            btnLabel: 'Valider les signatures de chartes (TODO)',
            icon: 'bi-pen',
            text: 'Lorem ipsum'
        })
    }
    if (isStaff.value && (hasPerm('add_document'))) {
        pageCards.value.push({
            to: {name: 'ManageDocumentsLibrary'},
            btnLabel: 'Gérer la bibliothèque de documents',
            icon: 'bi-file-earmark',
            text: 'Lorem ipsum'
        })
    }
    if (hasPerm('add_project_association')) {
        pageCards.value.push({
            to: {name: 'ManageCharters'},
            btnLabel: 'Signer les chartes',
            icon: 'bi-pen',
            text: 'Lorem ipsum'
        })
    }
    if (hasPerm('add_project_association') || hasPerm('add_project_user')) {
        pageCards.value.push({
            to: {name: 'DocumentsLibrary'},
            btnLabel: 'Télécharger les documents',
            icon: 'bi-download',
            text: 'Lorem ipsum'
        })
    }
}

onMounted(initPageCards)

</script>

<template>
    <section>
        <LayoutImageText
            img="unistra.jpg"
            text="Pour les associations du site Alsace"
            title="Charte du site Alsace"
        />
        <LayoutTextImageColor
            color="charter"
            img="unistra.jpg"
            text="Pour les demandes d'agrément"
            title="Chartes FSDIE / IdEx"
        />
        <LayoutPageCards
            v-if="pageCards.length"
            :page-cards="pageCards"
            color="charter"
        />
    </section>
</template>
