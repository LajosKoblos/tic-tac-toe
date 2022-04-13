<script setup lang="ts">
import NewGame from "@/components/NewGame.vue"
</script>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    async createGame() {
      const id = await (await fetch(`http://localhost:3000`, {method:"POST"})).text();
      this.openGame(id);
    },
    openGame(id: string) {
      this.$router.push('/play/'+id)
    }
  }
})
</script>

<template>
  <main>
    <NewGame @create="createGame"/>
  </main>
</template>