<script setup>
import { ref, computed, onMounted } from 'vue'
import { collection, addDoc } from "firebase/firestore"
import { Notify } from 'quasar';

import { db } from 'src/firebase'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const loadingSaveData = ref(false)

const dialog = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
const form = ref({})

const resetForm = () => {
  form.value = {
    // init with the date of today
    date: new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate(),
  }
}


onMounted(() => {
  resetForm()
})


const saveData = () => {
  loadingSaveData.value = true
  addDoc(collection(db, "litoral"), {
    date: form.value.date,
    alturaMaximaOla: form.value.alturaMaximaOla,
    alturaMinimaOla: form.value.alturaMinimaOla
  })
    .then(() => {
      resetForm()
      loadingSaveData.value = false
      dialog.value = false
      Notify.create({
        message: 'Datos guardados correctamente',
        color: 'green',
        icon: 'check'
      })
    })
}
</script>

<template>
  <q-dialog
    v-model="dialog"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card>
      <q-toolbar class="bg-primary text-white bar-sticky">
        <div>
          Formulario de datos
        </div>

        <q-space />

        <q-btn
          dense
          flat
          icon="close"
          v-close-popup
        >
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-form @submit.prevent="saveData()">
        <q-card-section>
          <div class="row q-col-gutter-md">
            <q-input
              class="col-12 col-sm-3 col-md-2"
              filled
              v-model="form.date"
              mask="date"
              :rules="['date']"
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="form.date">
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <q-input
              v-model="form.alturaMaximaOla"
              filled
              class="col-12 col-sm-3 col-md-2"
              label="Altura máxima ola"
              type="number"
            />
            <q-input
              v-model="form.alturaMinimaOla"
              filled
              class="col-12 col-sm-3 col-md-2"
              label="Altura mínima ola"
              type="number"
            />
          </div>
        </q-card-section>
        <q-card-section class="flex q-pt-none">
          <q-space />
          <q-btn
            color="positive"
            label="Guardar"
            :loading="loadingSaveData"
            type="submit"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.bar-sticky {
  position: sticky;
  top: 0;
  z-index: 1;
}
</style>