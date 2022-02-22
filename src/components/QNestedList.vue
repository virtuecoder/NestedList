<template>
<q-list  dense>
  <div v-for="item in itemsDate" :key="item.id" draggable="true" @dragstart="(event) => onDrag(event)" @dragend="(event) => onDragEnd(event)" @dragover.prevent="(event) => onDragOver(event)" @dragleave="(event) => onDragLeave(event)" @dragenter="(event) => onDragEnter(event)">
      <q-item clickable :id="item.id" style="box-sizing: border-box">
        <div class="row no-wrap items-center">
          <q-icon
            v-if="item.childreen.length"
            :name="`${item.childreen.length ? 'play_arrow' : 'play_arrow'}`"
            size="xs"
            color="dark-grey"

          />
          <q-icon name="radio_button_unchecked" v-else color="light-grey" size="0.75em" />
          <span class="col">{{item.title}}</span>
        </div>
      </q-item>
    <q-list v-if="item.childreen.length" dense class="q-pl-md">
      <QNestedList :items="item.childreen" />
    </q-list>
  </div>
</q-list>
</template>

<script lang="ts">

import {defineComponent} from 'vue';

export type ObjectType = {
  id: string
  label: string
  parent: ObjectType | null
  children: ObjectType[]
  expanded: boolean
  el?: HTMLElement
}
export type ItemsType = {
  id: number
  label: string
  children: ItemsType[]
}

export default defineComponent({
  props: {
    items: {required: true, type: [] as any}
  },
  data() {
    return {
      itemDragedID: '0',
      selectedItem: '0',
      itemsDate: [] as any,
      STB: [false,false,false]
    }
  },
  mounted() {
  this.itemsDate = this.items
    },
  methods: {
    onDrag(event: any) {
      event.target!.style.opacity = '0.7';
      this.selectedItem = event.target.childNodes[0].id;
    },
    addNestedInside(ourItems: any, item: any){
      let allowNesting = false
      ourItems.map((item2: any) => {
        if (item2.id == this.itemDragedID) {
          if (item2.id == this.itemDragedID) allowNesting = true
        }
      })
      if (allowNesting){
        let ourList = ourItems.map((item1: any) => item1)
        ourList.map((item2: any, index: any) => {
          if (item2.id == this.itemDragedID) {
            if (item2.id == this.itemDragedID) ourItems[index].childreen.splice(-1,0,item[0])
          }
        })
      } else {
        ourItems.map((item2: any) => {
          if (item2.childreen.length) item2.childreen = this.addNestedInside(item2.childreen, item)
        })
      }
      return ourItems
    },
    addNestedTop(ourItems: any, item: any){
      let allowNesting = false
      ourItems.map((item2: any) => {
        if (item2.id == this.itemDragedID) {
          if (item2.id == this.itemDragedID) allowNesting = true
        }
      })
      if (allowNesting){
        let ourList = ourItems.map((item1: any) => item1)
        ourList.map((item2: any, index: any) => {
          if (item2.id == this.itemDragedID) {
            if (item2.id == this.itemDragedID) ourItems.splice(index,0,item[0])
          }
        })
      } else {
        ourItems.map((item2: any) => {
          if (item2.childreen.length) item2.childreen = this.addNestedTop(item2.childreen, item)
        })
      }
      return ourItems
    },
    addNestedBottom(ourItems: any, item: any){
      let allowNesting = false
      ourItems.map((item2: any) => {
        if (item2.id == this.itemDragedID) {
          if (item2.id == this.itemDragedID) allowNesting = true
        }
      })
      if (allowNesting){
        let ourList = ourItems.map((item1: any) => item1)
        ourList.map((item2: any, index: any) => {
          if (item2.id == this.itemDragedID) {
            if (item2.id == this.itemDragedID) ourItems.splice(index+1,0,item[0])
          }
        })
      } else {
        ourItems.map((item2: any) => {
          if (item2.childreen.length) item2.childreen = this.addNestedBottom(item2.childreen, item)
        })
      }
      return ourItems
    },
    onDragEnd(event: any) {
      document.getElementById(this.itemDragedID)!.style.boxShadow = 'none'
      event.target!.style.opacity = '1';
      if (this.STB[0]){
        const item = this.itemsDate.filter((itemm: any) => itemm.id == this.selectedItem);
        this.itemsDate = this.itemsDate.filter((itemm: any) => itemm.id != this.selectedItem)
        this.itemsDate = this.addNestedInside(this.itemsDate, item)
        // console.log(this.itemsDate)
      }else if(this.STB[1]){
        const item = this.itemsDate.filter((itemm: any) => itemm.id == this.selectedItem);
        this.itemsDate = this.itemsDate.filter((itemm: any) => itemm.id != this.selectedItem)
        // let ourList = this.itemsDate.map((item1: any) => item1)
        // ourList.map((item2: any, index: any) => {
        //   if (item2.id == this.itemDragedID) this.itemsDate.splice(index,0,item[0])
        // })
        this.addNestedTop(this.itemsDate, item)
      }else if(this.STB[2]){
        const item = this.itemsDate.filter((itemm: any) => itemm.id == this.selectedItem);
        this.itemsDate = this.itemsDate.filter((itemm: any) => itemm.id != this.selectedItem)
        // let ourList = this.itemsDate.map((item1: any) => item1)
        // ourList.map((item2: any, index: any) => {
        //   if (item2.id == this.itemDragedID) this.itemsDate.splice(index+1,0,item[0])
        // })
        this.addNestedBottom(this.itemsDate, item)
      }
    },
    onDragOver(event: any){
      document.getElementById(event.target.id)!.style.boxShadow = 'none'
      if ( event.layerY > 15 && event.layerY <= 30){
        // All edges
        document.getElementById(event.target.id)!.style.boxShadow = 'inset 0px 0px 0px 3px blue'
        this.STB[0] = true;
        this.STB[1] = false;
        this.STB[2] = false;
      }else if ( event.layerY >= 15) {
        // Bottom
        document.getElementById(event.target.id)!.style.boxShadow = 'inset 0px -3px 0px 0px blue'
        this.STB[0] = false;
        this.STB[1] = false;
        this.STB[2] = true;
      } else if ( event.layerY < 30){
        // UP
        document.getElementById(event.target.id)!.style.boxShadow = 'inset 0px 3px 0px 0px blue'
        this.STB[0] = false;
        this.STB[1] = true;
        this.STB[2] = false;
      }
    },
    onDragEnter(event: any) {
      this.itemDragedID = event.target.id
    },
    onDragLeave(event: any) {
      document.getElementById(event.target.id)!.style.boxShadow = 'none'
    }
  }
})
</script>

<style>

</style>
