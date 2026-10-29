<script lang="ts" setup>
import LayoutImageText from '@/components/layout/LayoutImageText.vue'
import LayoutTextImageColor from '@/components/layout/LayoutTextImageColor.vue'
import type {Content, ContentCode} from '#/content'
import {onMounted, ref} from 'vue'
import {useContentStore} from '@/stores/useContentStore'
import axios from 'axios'
import {useQuasar} from 'quasar'
import useErrors from '@/composables/useError'
import CharterImage1 from '@/assets/img/charter-image-1.jpg'
import CharterImage2 from '@/assets/img/charter-image-2.jpg'
import CharterImage3 from '@/assets/img/charter-image-3.jpg'

const {notify, loading} = useQuasar()
const {catchHTTPError} = useErrors()
const contentStore = useContentStore()

const firstBlock = ref<Content>()
const secondBlock = ref<Content>()
const thirdBlock = ref<Content>()

function findContentObject(code: ContentCode) {
  return contentStore.contents.find(obj => obj.code === code)
}

const initContents = () => {
  firstBlock.value = findContentObject('CHARTER_HOME_FIRST_BLOCK')
  secondBlock.value = findContentObject('CHARTER_HOME_SECOND_BLOCK')
  thirdBlock.value = findContentObject('CHARTER_HOME_THIRD_BLOCK')
}

async function onGetContents() {
  try {
    await contentStore.getContents({
      codes: [
        'CHARTER_HOME_FIRST_BLOCK',
        'CHARTER_HOME_SECOND_BLOCK',
        'CHARTER_HOME_THIRD_BLOCK',
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
  await onGetContents()
  initContents()
  loading.hide()
})

</script>

<template>
  <section>
    <LayoutImageText
      v-if="showTextBlock(firstBlock)"
      :img="CharterImage1"
      :text="firstBlock?.body"
      :title="firstBlock?.header"
    />
    <LayoutTextImageColor
      v-if="showTextBlock(secondBlock)"
      :img="CharterImage2"
      :text="secondBlock?.body"
      :title="secondBlock?.header"
      color="charter"
    />
    <LayoutImageText
      v-if="showTextBlock(thirdBlock)"
      :img="CharterImage3"
      :text="thirdBlock?.body"
      :title="thirdBlock?.header"
    />
  </section>
</template>
