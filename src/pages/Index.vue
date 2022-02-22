<template>
  <q-page>
    <div class="row">
      <q-card id="left" class="q-ma-sm">
        <q-card-section>
          <div class="text-h5">Activities</div>
        </q-card-section>

        <q-card-section id="domains" class="q-py-none">
          <q-list dense>
            <Domain
              v-for="node in domainStore.root.children"
              :key="node.id"
              :node="node"
              id="domains"
            />
            <q-card-section>
              <div class="text-h5">Activities 2</div>
            </q-card-section>
            <!-- <DndTree :store="domainStore"></DndTree> -->
            <QNestedList :items="items" />
          </q-list>
        </q-card-section>

        <q-card-section dense>
          <div class="row items-center">
            <div class="col">
              <q-input
                dense
                label="New domain name"
                v-model="domainStore.newName"
                @keyup.enter="domainStore.addNew()"
                class="col"
              ></q-input>
            </div>
            <q-btn round size="sm" color="secondary" icon="add" @click="domainStore.addNew()">
              <q-tooltip>Add new domain to the root</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import Domain from 'src/components/Domain.vue';
import { useDomain, } from 'src/store/Domain';
import { defineComponent, onMounted } from 'vue';
import QNestedList from 'src/components/QNestedList.vue';

export default defineComponent({
  name: 'MainPage',
  components: {QNestedList, Domain },
  data: () => {
    return {
      items: [
        {
          id: 1,
          title: 'Test 1',
          childreen: []
        },
        {
          id: 2,
          title: 'Test 2',
          childreen: []
        },
        {
          id: 3,
          title: 'Test 3',
          childreen: []
        },
        {
          id: 4,
          title: 'Test 4',
          childreen: []
        },
        {
          id: 5,
          title: 'Test 5',
          childreen: []
        },
        {
          id: 6,
          title: 'Test 6',
          childreen: []
        },
        {
          id: 7,
          title: 'Test 7',
          childreen: []
        }
      ]
    }
  },
  setup() {
    const domainStore = useDomain()

    // Should be executed afer loading from an external source.
    domainStore.finishLoad()

    onMounted(() => {
      const width = document.getElementById('domains')!.getBoundingClientRect().width
      domainStore.setWidth(width)
    })

    return { domainStore };
  },

});
</script>

<style lang="sass">

#left
  min-width: 400px
  // max-width: 300px

#right
  min-width: 400px
</style>
