import {useRoute} from 'vue-router'
import {ref, watch} from 'vue'

const colorVariant = ref<string>('')


export default function() {
    const route = useRoute()

    const initColorVariant = () => {
        colorVariant.value = route.meta.colorVariant as string
    }
    watch(() => route.meta.colorVariant, initColorVariant)


    return {colorVariant}
}
