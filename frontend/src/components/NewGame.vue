<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
})
</script>

<template>
<button @click="$emit('create')">New Game</button>
</template>