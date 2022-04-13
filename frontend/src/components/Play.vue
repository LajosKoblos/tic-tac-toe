<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data: () => ({
        game: [0,1,1,2,0,0,1,1,1,2,2],
        error: false
    }),

  created() {
    this.fetchData()
  },

  watch: {
    currentBranch: 'fetchData'
  },

  methods: {
    async fetchData() {
      this.game = await (await fetch(`http://localhost:3000/${this.$route.params.id}`)).json()
    },
    async move(field: number) {
        const res = await fetch(
            `http://localhost:3000/${this.$route.params.id}`,
            {
                method:"PUT",
                headers: {
                  'Content-Type': 'application/json'
                },
                body:JSON.stringify({field:field,state:this.game[9]})
            }
        );
        if (res.status == 200) {
            this.game = await res.json();
            this.error = false;
        } else {
            this.error = true;
        }
    }
  }
})
</script>

<template>
<h2 v-if="game[10] == 2">Turn: {{game[9] == 2 ? " " : game[9] == 0 ? "X" : "O"}}</h2>
<h2 v-if="game[10] != 2">Winner: {{game[10] == 2 ? " " : game[10] == 0 ? "X" : "O"}}</h2>
<table>
    <tr>
        <td @click="move(0)">
            {{game[0] == 2 ? " " : game[0] == 0 ? "X" : "O"}}
        </td>
        <td @click="move(1)">
            {{game[1] == 2 ? " " : game[1] == 0 ? "X" : "O"}}
        </td>
        <td @click="move(2)">
            {{game[2] == 2 ? " " : game[2] == 0 ? "X" : "O"}}
        </td>
    </tr>
    <tr>
        <td @click="move(3)">
            {{game[3] == 2 ? " " : game[3] == 0 ? "X" : "O"}}
        </td>
        <td @click="move(4)">
            {{game[4] == 2 ? " " : game[4] == 0 ? "X" : "O"}}
        </td>
        <td @click="move(5)">
            {{game[5] == 2 ? " " : game[5] == 0 ? "X" : "O"}}
        </td>
    </tr>
    <tr>
        <td @click="move(6)">
            {{game[6] == 2 ? " " : game[6] == 0 ? "X" : "O"}}
        </td>
        <td @click="move(7)">
            {{game[7] == 2 ? " " : game[7] == 0 ? "X" : "O"}}
        </td>
        <td @click="move(8)">
            {{game[8] == 2 ? " " : game[8] == 0 ? "X" : "O"}}
        </td>
    </tr>
</table>
<h2 v-if="error">Wrong move</h2>
</template>

<style scoped>
table {
  table-layout: fixed;
  width: 300px;
  height: 300px;
  border-collapse: collapse;
}

td {
  padding: 20px;
  text-align: center;
  font-size: xx-large;
  text-shadow: 1px 1px 1px black;
  border: 3px solid purple;
  height: 100px;
}

td:hover {
  cursor: pointer;
}
</style>