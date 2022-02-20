import { defineStore } from 'pinia'

export type Domain = {
  id: string
  label: string
  parent: Domain | null
  children: Domain[]
  expanded: boolean
  el?: HTMLElement
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const domainMap: any = {}

let maxId = 0
function createDomain(name: string, children: Domain[] = []): Domain {
  const domain = {
    id: '' + maxId,
    label: name,
    parent: null,
    children,
    expanded: true,
  }
  maxId++
  domainMap[domain.id] = domain
  updateChildren(domain)
  return domain
}

function updateChildren(domain: Domain) {
  domain.children.forEach(child => updateChild(domain, child))
}

function updateChild(domain: Domain, child: Domain) {
  child.parent = domain
  updateChildren(child)
}

const ROOT = createDomain('', [
  createDomain('Work', [
    createDomain('Project A', [
      createDomain('Task 1'),
      createDomain('Task 2'),
      createDomain('Task 3'),
    ]),
    createDomain('Project B'),
    createDomain('Project C', [
      createDomain('Task 4'),
      createDomain('Task 5'),
    ]),
  ]),
  createDomain('Private', [
    createDomain('Family'),
    createDomain('House'), 
    createDomain('Education'),
  ]),
])

// const currentId = Array.from(items.values()).find(d => d.label === 'nested-list')!.id 

const findById = (domain: Domain, id: string) => find(domain, (d: Domain) => d.id === id)

function find(domain: Domain, condition: (d: Domain) => boolean): Domain | null {
  if (condition(domain)) return domain
  for (const child of domain.children) {
    const found = find(child, condition)
    if (found) return found
  }
  return null
}

function visit(domain: Domain, f: (d: Domain) => void) {
    f(domain)
    domain.children.forEach(child => visit(child, f))
}

export const useDomain = defineStore({
  id: 'domain',
  state: () => ({
    maxId,
    currentId: '',
    draggingId: '',
    draggingNode: null as Domain | null,
    dragOverNode: null as Domain | null,
    dragStartX: 0,
    dropAction: '',
    isLoading: true,
    domainMap,
    message: '',
    newName: '',
    itemHeight: 0,
    root: ROOT,
    width: 300,
  }),
  getters: {
    currentDomain: state => findById(state.root, state.currentId),
    currentLabel(): string { 
      return this.currentDomain?.label || ''
    },
  },
  actions: {
    currentNestedIds(nested: boolean): string[] {
      if (!this.currentId) return []
      if (nested) {
        const ids: string[] = []
        if (this.currentDomain) {
          visit(this.currentDomain!, d => ids.push(d.id))
        }
        return ids
      } else {
        return [this.currentId]
      }
    },
    getLabel(id: string) {
      return findById(this.root, id)?.label || ''
    },
    finishLoad() {
      updateChildren(this.root)
      visit(this.root, d => this.domainMap[d.id] = d)
      this.currentId = this.currentId || this.root.children[0]?.id || ''
      this.isLoading = false
      // console.log('finish load', this.root.children.length)
    },
    nestedIds(itemId: string, nested = true): string[] {
      // if (!itemId) return []
      if (nested) {
        const ids: string[] = []
        visit(findById(this.root, itemId)!, d => ids.push(d.id))
        return ids
      } else {
        return [itemId]
      }
    },
    setElement(id: string, el: HTMLElement) {
      const node = findById(this.root, id)
      if (node) {
        node.el = el
      }
      // console.log('setElement', node?.id, el)
    },
    setWidth(width: number) {
      this.width = width
    },
    setActive(node: Domain) {
      this.currentId = node.id
    },
    addNew(parent?: Domain) {
      const p = (parent || this.root)
      const domain = { id: '' + this.maxId, label: this.newName, parent: p, children: [] as Domain[], expanded: true }
      this.maxId++
      this.domainMap[domain.id] = domain
      p.children.push(domain)
      this.newName = ''
    },
    removeNode(node: Domain) {
      const children = node.parent!.children
      const index = children.indexOf(node)
      children.splice(index, 1)
      delete this.domainMap[node.id] 
      if (node.id === this.currentId) {
        this.currentId = ''
      }
    },
    removeCurrent() {
      if (!this.currentDomain) return
      this.removeNode(this.currentDomain)
      this.currentId = ''
    }, 
    renameCurrent(label: string) {
      if (!this.currentDomain) return
      this.currentDomain.label = label
    },
    // isNextSibling()
    expand(id: string, expanded: boolean) {
      const node = findById(this.root, id)
      if (node) {
        node.expanded = expanded
      }
    },
    isDragged(id: string) {
      // console.log(this.draggingId, id)
      return this.draggingId === id;
    },
    startDragging(e: DragEvent, node: Domain) {
      e.stopPropagation()
      // console.log('start drag', node.id)
      this.draggingNode = node
      this.draggingId = node.id
      this.dragStartX = e.clientX - this.draggingNode.el!.getBoundingClientRect().x
      this.itemHeight = this.draggingNode.el!.getBoundingClientRect().height

      const dragIndicatorStyle = document.getElementById('drag-indicator')!.style
      dragIndicatorStyle.width = this.width + 'px'
    },

    stopDragging(e: DragEvent) {
      e.preventDefault()
      e.stopPropagation()
      document.getElementById('drag-indicator')!.style.display = 'none'
      
      const draggingNode = this.draggingNode!
      // console.log('stop drag', draggingNode.id, this.dragOverNode?.id, this.dropAction)
      if (!this.dragOverNode) return
      let children = []
      let index = -1
      switch (this.dropAction) {
        case 'before':
          if (draggingNode === this.dragOverNode) break
          this.removeNode(draggingNode)
          children = this.dragOverNode.parent!.children
          index = children.indexOf(this.dragOverNode) 
          if (index === -1) index = children.length
          children.splice(index, 0, draggingNode)
          draggingNode.parent = this.dragOverNode.parent
          break;

        case 'after':
          let parent = this.dragOverNode.parent
          children = parent!.children
          index = children.indexOf(this.dragOverNode)

          // Move it outside of the parent if it is the last item in the children
          if (draggingNode === this.dragOverNode) {
            if (index === children.length - 1) {
              parent = parent!.parent
              if (parent) {
                children = parent.children
                index = children.indexOf(this.dragOverNode.parent!)
                this.removeNode(draggingNode)
                children.splice(index + 1, 0, draggingNode)
                draggingNode.parent = parent
              }
            }            
          } else {
            this.removeNode(draggingNode)
            index = children.indexOf(this.dragOverNode)
            children.splice(index + 1, 0, draggingNode)
            draggingNode.parent = parent
          }
          break;
          
        case 'child':
          this.removeNode(draggingNode)
          this.dragOverNode.children.push(draggingNode)
          draggingNode.parent = this.dragOverNode
          break;
      }
      clearFocusHelper(this.dragOverNode.el)
      clearFocusHelper(this.draggingNode?.el)
      this.draggingId = ''
      this.draggingNode = null
    },

    dragOver(e: DragEvent, node: Domain) {
      e.preventDefault() // So that it can be dropped in
      e.stopPropagation()
      e.dataTransfer!.dropEffect = 'move';
      this.dragOverNode = node
      const dragIndicatorStyle = document.getElementById('drag-indicator')!.style
      // Calculate the drop indicator bounds
      const bounds = node.el!.getBoundingClientRect()
      bounds.height = 28 // We want the title bar only, items with children are higher

      dragIndicatorStyle.left = '0'
      dragIndicatorStyle.width = this.width + 'px'
      dragIndicatorStyle.height = '4px'
     
      // console.log(e.clientY, bounds.y, bounds.bottom, node.label)

      if (e.clientY < bounds.y + bounds.height / 3) {
        // console.log('insert before')
        this.dropAction = 'before'
        dragIndicatorStyle.display = 'block'
        dragIndicatorStyle.top = bounds.top + 'px'

      } else if (e.clientY > bounds.y + bounds.height / 3 * 2) {
        // console.log('insert after')
        this.dropAction = 'after'
        dragIndicatorStyle.display = 'block'
        dragIndicatorStyle.top = bounds.bottom + 'px'

      } else if (node !== this.draggingNode) {
        // console.log('insert child')
        dragIndicatorStyle.display = 'block'
        dragIndicatorStyle.top = bounds.top + 'px'
        dragIndicatorStyle.left = bounds.left + 'px'
        dragIndicatorStyle.width = bounds.width + 'px'
        dragIndicatorStyle.height = bounds.height + 'px'
        this.dropAction = 'child'

      } else {
        // console.log('insert none')
        this.dropAction = ''
        dragIndicatorStyle.display = 'none'
      }
    }
  },
})

function clearFocusHelper(el?: HTMLElement) {
  const focusHelper = el?.firstElementChild?.firstElementChild as HTMLElement
  if (focusHelper) focusHelper.style.opacity = '0'
}

// eslint-disable-next-line 
// @ts-ignore
window.dr = function(bounds: any, color: string) { // eslint-disable-line 
  const el = document.createElement('div') as HTMLElement
  el.style.position = 'absolute'
  // eslint-disable-next-line 
  // @ts-ignore
  Object.keys(bounds).forEach(k => { el.style[k] = `${bounds[k]}px` }) // eslint-disable-line 
  el.style.border = '1px solid ' + color
  document.body.appendChild(el)
}

