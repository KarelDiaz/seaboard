
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Notify } from 'quasar'

import { useAuthStore } from "stores/auth";
import { auth } from 'src/firebase'

const authStore = useAuthStore()

const router = useRouter()

const registerName = ref('')
const registerEmail = ref('')
const registerPassword = ref('')

const loading = ref(false)

function ucFirstAllWords(str) {
  var pieces = str.split(" ");
  for (var i = 0; i < pieces.length; i++) {
    var j = pieces[i].charAt(0).toUpperCase();
    pieces[i] = j + pieces[i].substr(1);
  }
  return pieces.join(" ");
}

const register = () => {
  loading.value = true
  createUserWithEmailAndPassword(auth, registerEmail.value, registerPassword.value)
    .then((userCredential) => {
      // update displayName
      updateProfile(userCredential.user, {
        displayName: ucFirstAllWords(registerName.value),
      })
        .then(async () => {
          await authStore.login(userCredential.user)
          Notify.create({
            message: 'Usuario registrado',
            color: 'green',
            icon: 'check'
          })
          loading.value = false
          router.push('/')
        })
        .catch((error) => {
          console.log(error)
        })

    })
}
</script>

<template>
  <q-page class="q-pa-lg flex flex-center">
    <q-form @submit.prevent="register()">
      <q-card>
        <q-card-section>
          <div class="text-h6">Registro</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            autofocus
            v-model="registerName"
            label="Nombre"
            required
          />
          <q-input
            dense
            autofocus
            v-model="registerEmail"
            label="Email"
            required
          />
          <q-input
            dense
            v-model="registerPassword"
            label="Password"
            type="password"
            required
          />
        </q-card-section>
        <q-card-actions
          align="center"
          class="text-primary"
        >
          <q-btn
            flat
            label="Enviar"
            type="submit"
            :loading="loading"
          />
        </q-card-actions>
      </q-card>
    </q-form>
  </q-page>
</template>
