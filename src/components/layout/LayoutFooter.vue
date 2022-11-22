<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <QFooter elevated>
    <QToolbar>
      <div class="footer-text">
        <q-toolbar-title>{{ $t("footer.copyright") }}</q-toolbar-title>
        <RouterLink to="/" class="li-footer">{{ $t("footer.about") }}</RouterLink>
        <RouterLink to="/" class="li-footer">{{ $t("footer.legal-notice") }}</RouterLink>
        <RouterLink to="/" class="li-footer">{{ $t("footer.contact") }}</RouterLink>
      </div>
    </QToolbar>
  </QFooter>
</template>

<style scoped lang="sass">
.q-toolbar
  justify-content: center

.footer-text
  text-align: center

.li-footer
  color: white
  padding: 0.3em

.li-footer:after
  content: "|"
  padding-left: 0.5em

.li-footer:last-child:after
  content: none

</style>
