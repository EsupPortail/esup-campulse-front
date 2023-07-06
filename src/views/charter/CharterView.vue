<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import LayoutPageCards from '@/components/layout/LayoutPageCards.vue'
import type {PageCard} from '#/index'
import useUserGroups from '@/composables/useUserGroups'

const {isStaff} = useUserGroups()

const studentPageCards: PageCard[] = [
    {
        to: {name: 'ManageCharters'},
        btnLabel: 'Signer les chartes',
        icon: 'bi-pen',
        text: 'Lorem ipsum'
    },
    {
        to: {name: 'DocumentsLibrary'},
        btnLabel: 'Télécharger les documents',
        icon: 'bi-download',
        text: 'Lorem ipsum'
    }
]

const managerPageCards: PageCard[] = [
    {
        to: {name: 'ManageCharters'},
        btnLabel: 'Valider les signatures de chartes (TODO)',
        icon: 'bi-pen',
        text: 'Lorem ipsum'
    },
    {
        to: {name: 'ManageDocumentsLibrary'},
        btnLabel: 'Gérer la bibliothèque de documents',
        icon: 'bi-file-earmark',
        text: 'Lorem ipsum'
    }
]
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
            title="Chartes FSDIE/IdEx"
        />
        <LayoutPageCards
            :page-cards="isStaff ? managerPageCards : studentPageCards"
            color="charter"
        />
    </section>
</template>
