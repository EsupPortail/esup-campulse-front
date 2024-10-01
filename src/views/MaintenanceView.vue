<script lang="ts" setup>
import {onMounted} from 'vue'
import {useAxios} from '@/composables/useAxios'
import router from '@/router'
import LayoutMinimalHeader from '@/components/layout/LayoutMinimalHeader.vue'
import {useI18n} from 'vue-i18n'
import useUtility from '@/composables/useUtility'


const {axiosPublic} = useAxios()
const {t} = useI18n()
const {dynamicTitle} = useUtility()

onMounted(async () => {
    try {
        // Ping API 
        await axiosPublic.get('/')
        // If status is 200, then push back to homepage
        await router.push({name: 'Home'})
    } catch (error) {
        // If we catch an error, we stay here
        return
    }
})

const appDomain = (): string => {
    const appUrl = import.meta.env.VITE_APP_FRONT_URL
    return appUrl.replace(/^https?:\/\//, '')
}

onMounted(() => {
    dynamicTitle.value = t('maintenance.title')
})
</script>

<template>
    <QLayout
        class="layout-page"
        view="hhh lpr fff"
    >
        <LayoutMinimalHeader/>
        <main>
            <div class="container">
                <hgroup>
                    <h1>{{ t('maintenance.page-title') }}</h1>
                    <p>{{ appDomain() }}</p>
                </hgroup>
                <div>
                    <p>{{ t('maintenance.message-1') }}</p>
                    <p>{{ t('maintenance.message-2') }}</p>
                </div>
            </div>
        </main>
        <footer>
            <p>{{ t('university-name') }}</p>
        </footer>
    </QLayout>
</template>

<style lang="scss" scoped>
@import '@/assets/_variables.scss';

main {
    position: relative;

    .container {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
    }
}

hgroup {
    p {
        font-size: 3rem;
    }
}

footer {
    background-color: $associationColorBackground;
    text-align: center;
    padding: 3rem 0 1rem 0;

    p {
        text-transform: uppercase;
    }
}
</style>