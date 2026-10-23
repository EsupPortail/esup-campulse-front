import {useRoute} from 'vue-router'
import {computed} from 'vue'


export default function useColorVariant() {

  const route = useRoute()

  const colorVariant = computed<string>(() => {
    return route.meta.colorVariant as string
  })

  return {
    colorVariant
  }
}
