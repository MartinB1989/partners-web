import { defineStore } from 'pinia'

type AlertLocation =
  | 'top'
  | 'bottom'
  | 'start'
  | 'end'
  | 'left'
  | 'right'
  | 'center'
  | 'center center'
  | 'top start'
  | 'top end'
  | 'top left'
  | 'top right'
  | 'top center'
  | 'bottom start'
  | 'bottom end'
  | 'bottom left'
  | 'bottom right'
  | 'bottom center'
  | 'start top'
  | 'start bottom'
  | 'start center'
  | 'end top'
  | 'end bottom'
  | 'end center'
  | 'left top'
  | 'left bottom'
  | 'left center'
  | 'right top'
  | 'right bottom'
  | 'right center'

interface AlertState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  timeout: number
  location: AlertLocation
}

export const useAlertStore = defineStore('alert', {
  state: (): AlertState => ({
    show: false,
    message: '',
    type: 'info',
    timeout: 10000,
    location: 'top'
  }),

  actions: {
    showAlert(
      message: string, 
      type: 'success' | 'error' | 'warning' | 'info' = 'info', 
      timeout: number = 5000,
      location: AlertLocation = 'right bottom'
    ) {
      this.message = message
      this.type = type
      this.timeout = timeout
      this.location = location
      this.show = true

      setTimeout(() => {
        this.hideAlert()
      }, timeout)
    },
    hideAlert() {
      this.show = false
    }
  }
})