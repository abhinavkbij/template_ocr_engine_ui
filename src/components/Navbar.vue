// components/Navbar.vue
<template>
  <nav class="bg-white shadow-lg border-b">
    <div class="w-full px-4">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center space-x-8">
          <h1 class="text-xl font-bold text-gray-800">OCR Engine</h1>
          <div class="hidden md:flex space-x-6">
            <router-link
                v-for="item in navItems"
                :key="item.name"
                :to="item.path"
                class="text-gray-600 hover:text-blue-600 transition-colors"
                :class="{ 'text-blue-600 font-medium': $route.name === item.name }"
            >
              {{ item.label }}
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">{{ userEmail }}</span>
          <button
              @click="logout"
              class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userEmail = ref('')

const navItems = [
  { name: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { name: 'upload', label: 'Upload Files', path: '/upload' },
  { name: 'templates', label: 'Templates', path: '/templates' },
  { name: 'settings', label: 'Settings', path: '/settings' }
]

onMounted(() => {
  userEmail.value = localStorage.getItem('userEmail') || 'User'
})

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userEmail')
  router.push('/login')
}
</script>
