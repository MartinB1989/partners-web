<template>
  <v-container class="pa-0 ma-0" fluid style="height: 100vh;">
    <v-row class="fill-height" no-gutters>
      <!-- Lado izquierdo - Formulario -->
      <v-col cols="12" md="6" class="pa-0 d-flex align-center justify-center">
        <v-card flat width="70%" class="mx-auto">
          <v-card-title class="text-h4 mb-4">
            Iniciar sesión
          </v-card-title>
          
          <v-card-text>
            <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Correo electrónico"
                type="email"
                :rules="[rules.required, rules.email]"
                variant="outlined"
                prepend-inner-icon="mdi-email"
                class="mb-4"
              />
              
              <v-text-field
                v-model="password"
                label="Contraseña"
                :type="showPassword ? 'text' : 'password'"
                :rules="[rules.required]"
                variant="outlined"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                class="mb-6"
                @click:append-inner="showPassword = !showPassword"
              />
              
              <v-btn 
                color="primary" 
                block 
                size="large" 
                type="submit"
                :loading="isLoading"
                :disabled="!isFormValid"
              >
                Ingresar
              </v-btn>
              
              <div class="text-center mt-4">
                <v-btn variant="text" color="primary" class="text-none">
                  ¿Olvidaste tu contraseña?
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Lado derecho - Imagen -->
      <v-col cols="12" md="6" class="pa-0 d-none d-md-block">
        <v-img
          src="https://cdn.pixabay.com/photo/2019/05/05/18/58/girl-4181395_1280.jpg"
          cover
          class="fill-height"
          alt="Imagen de inicio de sesión"
        >
          <div class="fill-height d-flex flex-column justify-center align-center" style="background-color: rgba(0,0,0,0.3);">
            <div class="text-white text-center px-8">
              <h2 class="text-h3 font-weight-bold mb-4">¡Bienvenido de nuevo!</h2>
              <div class="text-h6">Accede a tu panel de administración para gestionar tu tienda</div>
            </div>
          </div>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAlertStore } from '~/stores/alert'
import { useAuthService } from '~/services/auth.services'
import { useAuthStore } from '~/stores/auth'

// Redirigir si ya está autenticado
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/admin/dashboard')
  }
})

definePageMeta({
  layout: 'clean'
})

const authService = useAuthService()
const alertStore = useAlertStore()
const form = ref()
const isFormValid = ref(false)

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const rules = {
  required: (v: string) => !!v || 'Este campo es obligatorio',
  email: (v: string) => /.+@.+\..+/.test(v) || 'Introduce un correo electrónico válido'
}

const handleLogin = async () => {
  // Validar formulario
  const { valid } = await form.value.validate()
  if (!valid) return
  
  isLoading.value = true
  try {
    await authService.login({
      email: email.value,
      password: password.value
    })
    
    // Verificar si el usuario tiene el rol de administrador
    if (authStore.isAdmin) {
      alertStore.showAlert('Inicio de sesión exitoso', 'success')
      router.push('/admin/panel')
    } else {
      // Si el usuario no es administrador, cerrar sesión y mostrar error
      authStore.logout()
      alertStore.showAlert('No tienes permisos para acceder al panel de administración', 'error')
    }
  } catch (error: unknown) {
    console.error('Error al iniciar sesión:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión. Verifica tus credenciales.'
    alertStore.showAlert(errorMessage, 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>
