<template>
  <router-view />
  <div id="drag-indicator"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useTheme } from 'src/store/Theme'

export default defineComponent({
  name: 'App',
  setup() {
    const theme = useTheme()
    theme.setCurrent()
    
    document.addEventListener('dragover', function (e: DragEvent) {
      e.preventDefault()
      e.dataTransfer!.dropEffect = 'move';
    }, false);
  }
})
</script>

<style lang="sass">

#drag-indicator
  display: none
  position: absolute
  top: 100px
  height: 4px
  width: 100%
  box-shadow: inset 3px 3px $primary, inset -3px -3px $primary
  z-index: 10
</style>
