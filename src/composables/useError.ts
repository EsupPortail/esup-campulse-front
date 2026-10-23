import type {Error} from '#/global'
import {useRoute} from 'vue-router'
import router from '@/router'
import i18n from '@/plugins/i18n'

export default function useError() {

  const route = useRoute()

  async function catchHTTPError(error: Error): Promise<string> {
    if (import.meta.env.VITE_APP_ENABLE_BACKEND_ERRORS === 'true' && (error.data.error !== '')) {
      return `${error.status} : ${JSON.stringify(error.data)}`
    } else if (error.status === 503) {
      if (route.name !== 'Maintenance') {
        await router.push({name: 'Maintenance'})
      }
    }
    return i18n.global.t(`notifications.negative.error-${error.status.toString()}`)
  }

  return {
    catchHTTPError
  }
}
