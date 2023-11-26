<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "vue-router"
import { Notify } from 'quasar'

import { useAuthStore } from "stores/auth"
import { auth } from 'src/firebase'

const authStore = useAuthStore()

const router = useRouter()

const email = ref('')
const password = ref('')

const errorMsg = ref('')

const loading = ref(false)

const login = () => {
  loading.value = true
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      await authStore.login(userCredential.user)
      loading.value = false
      Notify.create({
        message: `Bienvenido ${userCredential.user.displayName}`,
        color: 'green',
        icon: 'check'
      })
      router.push('/')
    })
    .catch((error) => {
      loading.value = false
      switch (error.code) {
        case 'auth/invalid-login-credentials':
          errorMsg.value = 'Credenciales inválidas'
          break;
        case 'auth/user-not-found':
          errorMsg.value = 'Usuario no encontrado'
          break;
        case 'auth/wrong-password':
          errorMsg.value = 'Contraseña incorrecta'
          break;
      }
    })
}
</script>

<template>
  <q-page class="q-pa-lg flex column flex-center">
    <q-card>
      <q-card-section>
        <div class="text-h6">Bienvenido</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input
          dense
          autofocus
          v-model="email"
          label="Correo electrónico"
        />
        <q-input
          dense
          v-model="password"
          label="Contraseña"
          type="password"
        />

        <!-- error message -->
        <div
          v-if="errorMsg"
          class="q-pt-md text-negative"
        >
          {{ errorMsg }}
        </div>
      </q-card-section>
      <q-card-actions
        align="center"
        class="text-secondary"
      >
        <q-btn
          v-if="email !== '' && password !== ''"
          flat
          label="Entrar"
          @click="login()"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>

    <q-btn
      flat
      color="primary"
      class="q-mt-md"
      to="/auth/register"
    >
      Registrarme
    </q-btn>
  </q-page>
</template>

