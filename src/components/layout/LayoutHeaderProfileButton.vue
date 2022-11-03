<script setup lang="ts">
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

</script>

<template>
  <div class="q-pa-md" v-if="userStore.isAuth()">
    <q-btn-dropdown color="cyan" no-caps @click="onMainClick" align="between" padding="0">
      <template v-slot:label>
        <div class="row items-center no-wrap">

          <div class="avatar">
            <q-avatar color="primary" text-color="white" size="2em">{{ userStore.userNameFirstLetter }}</q-avatar>
          </div>

          <div class="text-center">
           <!-- <p>{{ userStore.user.first_name }}</p> -->
          </div>

        </div>
      </template>

      <q-list>
        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>
              <RouterLink to="/dashboard" class="label">Mon espace</RouterLink>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>
              <RouterLink to="/logout" class="label" style="color:red">Déconnexion</RouterLink>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>


<style scoped lang="sass">

p
  font-size: 1.3em
  margin: 0

.avatar
  padding: 0.3em
  margin-right: 0.3em

.user-avatar
  width: 32px
  height: 32px
  border-radius: 50%
  border: 2px solid #fff
  position: relative
  margin-left: 5px

.user-avatar span
  position: absolute
  text-align: center
  font-size: 30px
  line-height: 0
  top: 15px
  left: 6px

.label
  color: black
  text-decoration: none

.label:hover
  background-color: rgba(255, 255, 255, 0.3)

</style>