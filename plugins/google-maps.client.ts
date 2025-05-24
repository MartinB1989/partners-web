import { defineNuxtPlugin } from '#app'
import type { GoogleMapsLibrary } from '@/types/google-maps'

// Extendemos el tipo Window global para TypeScript
declare global {
  interface Window {
    google?: GoogleMapsLibrary;
    initGoogleMaps?: () => void;
  }
}

/**
 * Plugin para cargar la API de Google Maps
 * El sufijo .client.ts asegura que este código solo se ejecute en el navegador
 */
export default defineNuxtPlugin(() => {
  // API key para Google Maps
  const apiKey = 'AIzaSyAic9di82x8C0qpgGF2qFpPFg3h2SRAIYw'
  
  // Función para cargar Google Maps
  const loadGoogleMaps = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolvemos inmediatamente
      if (window.google && window.google.maps) {
        resolve()
        return
      }
      
      // Definimos un callback global que Google Maps llamará cuando termine de cargar
      window.initGoogleMaps = () => {
        resolve()
      }

      // Creamos y agregamos el script al head
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async&callback=initGoogleMaps`
      script.async = true
      script.defer = true
      
      // Manejamos errores
      script.onerror = (_error) => {
        reject(new Error('Google Maps failed to load'))
      }
      
      // Agregamos el script al head
      document.head.appendChild(script)
    })
  }
  
  // Retornamos las funciones y valores que queremos exponer
  return {
    provide: {
      googleMaps: {
        load: loadGoogleMaps
      }
    }
  }
}) 