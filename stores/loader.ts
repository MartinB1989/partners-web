import { defineStore } from 'pinia';

interface LoaderState {
  loading: boolean;
  message: string;
}

export const useLoaderStore = defineStore('loader', {
  state: (): LoaderState => ({
    loading: false,
    message: 'Cargando...',
  }),
  
  actions: {
    startLoading(message: string = 'Cargando...') {
      this.loading = true;
      this.message = message;
    },
    
    stopLoading() {
      this.loading = false;
      this.message = 'Cargando...';
    },
  },
}); 