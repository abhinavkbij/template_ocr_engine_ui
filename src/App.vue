// App.vue
<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navbar v-if="isAuthenticated" />
    <main class="w-full px-4 py-8">
      <router-view />
    </main>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'
import {useAuthStore} from "./stores/auth.js";

const router = useRouter()
// const authToken = ref(localStorage.getItem('authToken'))
const autStore = useAuthStore();
let authToken = localStorage.getItem(`${autStore.userEmail}`);

const isAuthenticated = computed(() => !!authToken)

onMounted(() => {
  // Watch for auth changes
  window.addEventListener('storage', (e) => {
    if (e.key === 'authToken') {
      authToken = e.newValue
      if (!e.newValue) {
        router.push('/login')
      }
    }
  })
})
</script>