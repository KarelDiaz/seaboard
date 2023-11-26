<script setup >
import { ref, onBeforeUpdate } from 'vue'
import { Notify } from 'quasar';

import { useAuthStore } from "stores/auth";
import { auth } from 'src/firebase'
import EssentialLink from 'components/EssentialLink.vue'

const authStore = useAuthStore()

const loadingLogout = ref(false)

const linksList = [
  {
    title: 'Litoral',
    caption: 'Datos del litoral',
    icon: 'public',
    link: '/litoral'
  },
]

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const logout = () => {
  loadingLogout.value = true
  auth.signOut()
    .then(async () => {
      await authStore.logout()
      Notify.create({
        message: 'Sesión cerrada correctamente',
        color: 'green',
        icon: 'check'
      })
      loadingLogout.value = false
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>
        
<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          @click="toggleLeftDrawer"
          dense
          round
          icon="menu"
          aria-label="Menu"
        >
        </q-btn>

        <q-toolbar-title>
          Seaboard
        </q-toolbar-title>

        <div>
          <q-btn
            v-if="!authStore.user"
            to="/auth/login"
            color="positive"
          >
            <q-icon
              name="login"
              class="q-mr-sm"
            />
            Autenticación
          </q-btn>


          <!-- user actions -->
          <q-btn-dropdown
            flat
            :label="authStore.user.displayName"
            v-if="authStore.user"
            :loading="loadingLogout"
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="logout()"
              >
                <q-item-section>
                  <q-item-label>Salir</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>Menu </q-item-label>

        <EssentialLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

