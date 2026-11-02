<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import type {Content, ContentCode} from '#/content'
import {onMounted, ref} from 'vue'
import axios from 'axios'
import {useContentStore} from '@/stores/useContentStore'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useError'
import CommissionImage1 from '@/assets/img/commission-image-1.jpg'
import CommissionImage2 from '@/assets/img/commission-image-2.jpg'

const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const contentStore = useContentStore()

const firstBlock = ref<Content>()
const secondBlock = ref<Content>()

function findContentObject(code: ContentCode) {
  return contentStore.contents.find(obj => obj.code === code)
}

const initContents = () => {
  firstBlock.value = findContentObject('COMMISSION_HOME_FIRST_BLOCK')
  secondBlock.value = findContentObject('COMMISSION_HOME_SECOND_BLOCK')
}

async function onGetContent() {
  try {
    await contentStore.getContents({
      codes: [
        'COMMISSION_HOME_FIRST_BLOCK',
        'COMMISSION_HOME_SECOND_BLOCK',
      ]
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      notify({
        type: 'negative',
        message: await catchHTTPError(error.response)
      })
    }
  }
}

const showTextBlock = (content: Content): boolean => {
  const header = content?.header.replace(/<br>/g, '')
  const body = content?.body.replace(/<br>/g, '')
  return !!header && !!body
}

onMounted(async () => {
  loading.show()
  await onGetContent()
  initContents()
  loading.hide()
})

</script>

<template>
  <section>
    <LayoutImageText
      v-if="showTextBlock(firstBlock)"
      :img="CommissionImage1"
      :text="firstBlock?.body"
      :title="firstBlock?.header"
    />
    <LayoutTextImageColor
      v-if="showTextBlock(secondBlock)"
      :img="CommissionImage2"
      :text="secondBlock?.body"
      :title="secondBlock?.header"
      color="commission"
    />
  </section>
</template>
