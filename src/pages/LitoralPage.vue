<script setup>
import { ref, onMounted } from "vue"
import { collection, doc, addDoc, deleteDoc, query, onSnapshot } from "firebase/firestore"

import { db } from 'src/firebase'
import LitoralForm from 'src/components/LitoralForm.vue'
import { useAuthStore } from "stores/auth";

const authStore = useAuthStore()

const datos = ref([])
const datosSelected = ref([])

const loading = ref(false)

const dialog = ref(false)

const columns = [
  {
    name: 'date',
    required: true,
    label: 'Fecha',
    align: 'left',
    field: 'date',
    sortable: true
  },
  {
    name: 'alturaMinimaOla',
    required: true,
    label: 'Altura mínima ola',
    align: 'left',
    field: 'alturaMinimaOla',
    sortable: true
  },
  {
    name: 'alturaMaximaOla',
    required: true,
    label: 'Altura máxima ola',
    align: 'left',
    field: 'alturaMaximaOla',
    sortable: true
  }
]

const deleteOla = () => {
  for (let i = 0; i < datosSelected.value.length; i++) {
    deleteDoc(doc(db, "litoral", datosSelected.value[i].id));
  }
  datosSelected.value = []
}

onMounted(() => {
  loading.value = true
  onSnapshot(query(collection(db, "litoral")), (querySnapshot) => {
    const datosTemp = [];
    querySnapshot.forEach((doc) => {
      datosTemp.push({
        id: doc.id,
        date: doc.data().date,
        alturaMaximaOla: doc.data().alturaMaximaOla,
        alturaMinimaOla: doc.data().alturaMinimaOla
      });
    });
    datos.value = datosTemp;
    loading.value = false
  });
})
</script>

<template>
  <q-page class="q-pa-lg">
    <q-table
      :rows="datos"
      title="Altura de las olas"
      :columns="columns"
      row-key="id"
      :selection="authStore.user ? 'multiple' : 'none'"
      v-model:selected="datosSelected"
      :loading="loading"
    >
      <template v-slot:top-left>
        <q-btn
          v-if="datosSelected.length > 0"
          icon="delete"
          @click="deleteOla()"
        />
      </template>
      <template
        v-slot:top-right
        v-if="authStore.user"
      >

        <q-btn
          label="Agregar datos"
          color="positive"
          @click="dialog = true"
        />

        <LitoralForm v-model="dialog" />
      </template>
    </q-table>

  </q-page>
</template>
