<template>
  <v-container class="px-0">
    <v-row class="px-0">
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Perfil de Usuario</h1>
          <v-btn
            variant="outlined"
            prepend-icon="mdi-arrow-left"
            @click="() => router.back()"
          >
            Atrás
          </v-btn>
        </div>
        <v-card>
          <v-divider />

          <v-card-text class="pa-6">
            <v-form v-if="user">
              <!-- Información básica del usuario -->
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="userName"
                    label="Nombre"
                    variant="outlined"
                    density="comfortable"
                    prepend-inner-icon="mdi-account"
                    :disabled="isUpdatingUser"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    :model-value="user.email"
                    label="Email"
                    variant="outlined"
                    density="comfortable"
                    disabled
                    prepend-inner-icon="mdi-email"
                  />
                </v-col>
              </v-row>

              <!-- Botón de guardar cambios -->
              <v-row v-if="hasUserDataChanged">
                <v-col cols="12" class="d-flex justify-end gap-2">
                  <v-btn
                    color="grey"
                    variant="text"
                    :disabled="isUpdatingUser"
                    @click="resetUserData"
                  >
                    Cancelar
                  </v-btn>
                  <v-btn
                    color="primary"
                    :loading="isUpdatingUser"
                    :disabled="isUpdatingUser || !userName.trim()"
                    @click="handleUpdateUser"
                  >
                    Guardar cambios
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Configuración de vendedor (solo para ADMIN o PRODUCTOR) -->
              <v-row v-if="isVendor">
                <v-col cols="12">
                  <v-divider class="my-4" />
                  <h3 class="text-h6 mb-4">Configuración de Vendedor</h3>
                </v-col>

                <v-col cols="12" md="6">
                  <v-switch
                    v-model="sellerSettings.acceptsHomeDelivery"
                    label="Acepto envíos a domicilio"
                    color="primary"
                    :loading="isUpdatingDelivery"
                    :disabled="isUpdatingDelivery"
                    hide-details
                    @update:model-value="handleDeliveryToggle"
                  >
                    <template #prepend>
                      <v-icon>mdi-truck-delivery</v-icon>
                    </template>
                  </v-switch>
                </v-col>

                <v-col cols="12" md="6">
                  <v-switch
                    v-model="sellerSettings.acceptsPickup"
                    label="Acepto retiro en persona"
                    color="primary"
                    :loading="isUpdatingPickup"
                    :disabled="isUpdatingPickup"
                    hide-details
                    @update:model-value="handlePickupToggle"
                  >
                    <template #prepend>
                      <v-icon>mdi-store-marker</v-icon>
                    </template>
                  </v-switch>
                </v-col>
              </v-row>
            </v-form>

            <!-- Estado de carga -->
            <v-row v-else>
              <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate color="primary" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useUser } from '~/composables/services/useUser'
import { useAlertStore } from '~/stores/alert'
import type { SellerSettings } from '~/types/user'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const authStore = useAuthStore()
const userService = useUser()
const alertStore = useAlertStore()
const router = useRouter()

// Estado reactivo
const user = computed(() => authStore.user)
const userName = ref(user.value?.name || '')
const originalUserData = reactive({
  name: user.value?.name || ''
})
const isUpdatingUser = ref(false)
const isUpdatingDelivery = ref(false)
const isUpdatingPickup = ref(false)
const sellerSettings = reactive<Partial<SellerSettings>>({
  acceptsHomeDelivery: false,
  acceptsPickup: false
})

// Computed para verificar si los datos del usuario cambiaron
const hasUserDataChanged = computed(() => {
  return userName.value.trim() !== originalUserData.name.trim()
})

// Computed para verificar si el usuario es vendedor (ADMIN o PRODUCTOR)
const isVendor = computed(() => {
  const roles = user.value?.roles || []
  return roles.includes('ADMIN') || roles.includes('PRODUCTOR')
})

// Resetear los datos del usuario a los valores originales
const resetUserData = () => {
  userName.value = originalUserData.name
}

// Manejar actualización de los datos del usuario
const handleUpdateUser = async () => {
  const userId = authStore.getUserId

  if (!userId) {
    alertStore.showAlert('Usuario no autenticado', 'error')
    return
  }

  const newName = userName.value.trim()

  if (!newName) {
    alertStore.showAlert('El nombre no puede estar vacío', 'error')
    return
  }

  if (newName === originalUserData.name.trim()) {
    return
  }

  isUpdatingUser.value = true

  try {
    const { data, error } = await userService.updateUser(userId, { name: newName })

    if (error) {
      alertStore.showAlert(error, 'error')
      // Revertir el cambio
      userName.value = originalUserData.name
      return
    }

    if (data) {
      // Actualizar el usuario en el store
      authStore.setUser(data)
      // Actualizar los datos originales
      originalUserData.name = data.name
      userName.value = data.name
      alertStore.showAlert('Perfil actualizado correctamente', 'success', 2000)
    }
  } catch {
    alertStore.showAlert('Error inesperado al actualizar el perfil', 'error')
    // Revertir el cambio
    userName.value = originalUserData.name
  } finally {
    isUpdatingUser.value = false
  }
}

// Cargar configuración de vendedor si aplica
const loadSellerSettings = async () => {
  if (!isVendor.value) return

  const { data, error } = await userService.getSellerSettings()

  if (error) {
    alertStore.showAlert(error, 'error')
    return
  }

  if (data) {
    sellerSettings.acceptsHomeDelivery = data.acceptsHomeDelivery || false
    sellerSettings.acceptsPickup = data.acceptsPickup || false
  }
}

// Manejar cambio en el switch de envíos a domicilio
const handleDeliveryToggle = async (newValue: boolean | null) => {
  if (newValue === null) return

  isUpdatingDelivery.value = true
  const previousValue = !newValue

  try {
    const { data, error } = await userService.updateSellerSettings({
      acceptsHomeDelivery: newValue
    })

    if (error) {
      // Revertir el cambio si hay error
      sellerSettings.acceptsHomeDelivery = previousValue
      alertStore.showAlert(error, 'error')
      return
    }

    if (data) {
      // Actualizar con el valor confirmado del servidor
      sellerSettings.acceptsHomeDelivery = data.acceptsHomeDelivery || false
      alertStore.showAlert(
        newValue
          ? 'Ahora aceptas envíos a domicilio'
          : 'Ya no aceptas envíos a domicilio',
        'success',
        2000
      )
    }
  } catch {
    // Revertir el cambio si hay error inesperado
    sellerSettings.acceptsHomeDelivery = previousValue
    alertStore.showAlert('Error inesperado al actualizar la configuración', 'error')
  } finally {
    isUpdatingDelivery.value = false
  }
}

// Manejar cambio en el switch de retiro en persona
const handlePickupToggle = async (newValue: boolean | null) => {
  if (newValue === null) return

  isUpdatingPickup.value = true
  const previousValue = !newValue

  try {
    const { data, error } = await userService.updateSellerSettings({
      acceptsPickup: newValue
    })

    if (error) {
      // Revertir el cambio si hay error
      sellerSettings.acceptsPickup = previousValue
      alertStore.showAlert(error, 'error')
      return
    }

    if (data) {
      // Actualizar con el valor confirmado del servidor
      sellerSettings.acceptsPickup = data.acceptsPickup || false
      alertStore.showAlert(
        newValue
          ? 'Ahora aceptas retiro en persona'
          : 'Ya no aceptas retiro en persona',
        'success',
        2000
      )
    }
  } catch {
    // Revertir el cambio si hay error inesperado
    sellerSettings.acceptsPickup = previousValue
    alertStore.showAlert('Error inesperado al actualizar la configuración', 'error')
  } finally {
    isUpdatingPickup.value = false
  }
}

// Inicializar al montar el componente
onMounted(() => {
  if (user.value) {
    userName.value = user.value.name || ''
    originalUserData.name = user.value.name || ''
  }
  loadSellerSettings()
})
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>
