import { defineStore } from 'pinia'
import { setCssVar } from 'quasar'

import { Dark } from 'quasar'

export type Theme = {
  name: string,
  mode: 'light' | 'dark',
  primary: string,
  secondary: string,
  darkgrey: string,
  lightgrey: string
}

const lightTheme: Theme = {
  name: 'Default light',
  mode: 'light',
  primary: '#d41577',
  secondary: '#00BCD4',
  darkgrey: '#808080',
  lightgrey: '#c9c9c9',
}

const darkTheme: Theme = {
  name: 'Default dark',
  mode: 'dark',
  primary: '#d41577',
  secondary: '#4dd0e1',
  darkgrey: '#808080',
  lightgrey: '#c9c9c9',
}

export const useTheme = defineStore({
  id: 'theme',
  state: () => ({
    current: lightTheme,
    items: [lightTheme, darkTheme],
  }),

  getters: {
    
  },

  actions: {
    setCurrent (name?: string) {
      const item = this.items.find(it => it.name === name)
      this.current = item || (Dark.isActive ? darkTheme : lightTheme)
      Dark.set(this.current.mode === 'dark')
      // console.log(`set theme "${this.current.name}"`)
      setCssVar('primary', this.current.primary)
      setCssVar('secondary', this.current.secondary)
      setCssVar('dark-grey', this.current.darkgrey)
      setCssVar('light-grey', this.current.lightgrey)
    },
  }
})

