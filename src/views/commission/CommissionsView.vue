<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import LayoutPageCards from '@/components/layout/LayoutPageCards.vue'
import type {PageCard} from '#/index'
import useUserGroups from '@/composables/useUserGroups'

const {isStaff} = useUserGroups()

const studentPageCards: PageCard[] = [
    {
        to: {name: 'ManageProjects'},
        btnLabel: 'Gérer et déposer des projets',
        icon: 'bi-pencil',
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
        to: {name: 'ManageProjects'},
        btnLabel: 'Gérer les demandes de subventions',
        icon: 'bi-pencil',
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
            img-alt=""
            text="Pour les associations du site Alsace"
            title="CAPE"
        />
        <LayoutTextImageColor
            color="commission"
            img="unistra.jpg"
            img-alt=""
            text="Pour les porteurs individuels de projet"
            title="CAPE"
        />
        <LayoutPageCards
            :page-cards="isStaff ? managerPageCards : studentPageCards"
            color="commission"
        />
    </section>
</template>
