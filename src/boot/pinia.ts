import { createPinia } from 'pinia'
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  const pinia = createPinia()
  app.use(pinia)
})

  //  // Load initial store state from local storage
  //  const state = JSON.parse(localStorage.getItem(storeKey) || '')
  //  if (state) {

  //  }

  //  // Persist the whole state to the local storage whenever it changes
  //  watch( pinia.state, state => {
  //     localStorage.setItem(storeKey, JSON.stringify(state, (k, v) => k === 'parent' ? undefined : v))
  //   },
  //   { deep: true }
  // )
