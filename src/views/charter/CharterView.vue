<script lang="ts" setup>
import DashboardCharterStudent from '@/components/charter/DashboardCharterStudent.vue'
import useUserGroups from '@/composables/useUserGroups'
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'

const {isStaff} = useUserGroups()
</script>

<template>
    <section>
        <LayoutImageText
            img="unistra.jpg"
            img-alt=""
            text="Lorem ipsum"
            title="Chartes"
        />
        <LayoutTextImageColor color="charter"/>
    </section>
    <!-- To clean -->
    <DashboardCharterStudent v-if="!isStaff"/>
</template>
