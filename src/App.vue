// App.vue
<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar v-if="isAuthenticated" />
    <main class="container mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'

const router = useRouter()
// const authToken = ref(localStorage.getItem('authToken'))

// const isAuthenticated = computed(() => !!authToken.value)

onMounted(() => {
  // Watch for auth changes
  window.addEventListener('storage', (e) => {
    // if (e.key === 'authToken') {
    //   // authToken.value = e.newValue
    //   // if (!e.newValue) {
    //     router.push('/login')
    //   // }
    // }
  })
})
</script>