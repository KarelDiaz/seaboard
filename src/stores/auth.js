import { defineStore } from 'pinia';
import { ref } from "vue";
import { LocalStorage } from 'quasar'

export const useAuthStore = defineStore('auth', () => {

  /** @type {User | undefined} */
  const user = ref(LocalStorage.getItem('auth'))
  const isLogged = ref(!!LocalStorage.getItem('auth'))

  /**
   * Guarda la info del usuario en local storage
   * @param data {User}
   */
  const saveToLocalStorage = (data) => {
    user.value = { ...data }
    LocalStorage.set('auth', user.value)
  }
  /** Elimina la info del usuario en local storage */
  const clearLocalStorage = () => {
    LocalStorage.remove('auth')
  }
  /** Reset manual del store */
  const reset = () => {
    isLogged.value = false
    user.value = undefined
  }

  /**
   * Inicia sesión
   * @param credentials {Credentials}
   * @return {Promise<User>}
   */
  const login = async (credentials) => {
    saveToLocalStorage(credentials)
    isLogged.value = true
    return user
  }

  /**
   * Cierra la sesión del usuario
   */
  const logout = () => {
    console.log('logout')
    clearLocalStorage()
    reset()
  }




  return {
    user, isLogged,
    login, logout,
  }
})
