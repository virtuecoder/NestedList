<template>
  <div
    ref="el"
    draggable="true"
    @dragstart="domainStore.startDragging($event, node)"
    @dragend="domainStore.stopDragging($event)"
    @dragover="domainStore.dragOver($event, node)"
    :class="{ dragging: domainStore.isDragged(node.id) }"
  >
    <q-item clickable :active="node.id == domainStore.currentId" @click="setActive($event, node)">
      <div class="row no-wrap items-center">
        <q-icon
          name="play_arrow"
          size="xs"
          v-if="node.children.length"
          color="dark-grey"
          :class="{ rotated: node.expanded }"
          @click="domainStore.expand(node.id, !node.expanded)"
        />
        <q-icon name="radio_button_unchecked" v-else color="light-grey" size="0.75em" />

        <span class="col">{{ node.label }}</span>
       
      </div>
    </q-item>

    <q-list v-if="node.children.length && node.expanded" dense class="q-pl-md">
      <Domain v-for="child in node.children" :key="child.id" :node="child" />
    </q-list>
  </div>
</template>

<script lang="ts">
import { Domain, useDomain } from 'src/store/Domain'
import { ComponentPublicInstance, computed, defineComponent, onMounted, ref, watchEffect } from 'vue'

export default defineComponent({
  props: {
    node: { required: true, type: Object as () => Domain }
  },
  setup(props) {
    const domainStore = useDomain()
    const el = ref<ComponentPublicInstance<HTMLElement>>()
    const more = ref(false)
    const mounted = ref(false)
    const elSet = ref(false)

    const nestedIds = computed(() => domainStore.nestedIds(props.node.id))

    watchEffect(() => {
      // console.log('watch', mounted.value, !domainStore.isLoading)
      if (mounted.value && !domainStore.isLoading && el.value && !elSet.value) {
        domainStore.setElement(props.node.id, el.value)
        elSet.value = true
      }
    })

    onMounted(() => { mounted.value = true })

    return { domainStore, more, el, mounted, nestedIds }
  },

  methods: {
    setActive(event: MouseEvent, node: Domain) {
      // Prevent setting active when pressing a button on the item, e.g. expand/collapse
      event.stopPropagation()
      if ((event.target as HTMLElement).tagName === 'I') return
      this.domainStore.setActive(node)
    },
    // onMouseOver(e: MouseEvent) {
    //   e.stopPropagation()
    //   const focusHelper = this.$el.querySelector('.q-focus-helper') as HTMLElement
    //   focusHelper.style.visibility = 'visible'
    //   this.more = true
    // },
    // onMouseOut(e: MouseEvent) {
    //   e.stopPropagation()
    //   const focusHelper = this.$el.querySelector('.q-focus-helper') as HTMLElement
    //   focusHelper.style.visibility = 'hidden'
    //   this.more = false
    // },
  }
})
</script>

<style lang="sass" scoped>

.q-item
  padding: 0 0 0 0
  min-height: unset
  z-index: 20

  > .row
    width: 100%
    min-height: 2em

    > span
      padding-left: 6px
      overflow: hidden
      white-space: nowrap
      text-overflow: ellipsis

    .q-icon
      width: 18px

    i.rotated
      transform: rotate3d(0, 0, 1, 90deg)
      margin-top: -1px

  .more
    display: none
  .show-more
    display: flex

  :deep(.q-focus-helper)
    transition: unset

.q-item--active
  font-weight: bold

.dragging
  opacity: 0.5
</style>
