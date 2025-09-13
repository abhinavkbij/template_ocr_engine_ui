<template>
  <div class="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>

    <form @submit.prevent="handleLogin">
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">Email</label>
        <input
            v-model="form.email"
            type="email"
            required
            class="w-full px-4 py-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
        />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">Password</label>
        <input
            v-model="form.password"
            type="password"
            required
            class="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
        />
      </div>

      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md font-medium transition-colors border-0"
          style="min-height: 48px; display: block !important; background-color: #2563eb !important;"
      >
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>

    <div class="mt-6 text-center">
      <router-link to="/register" class="text-blue-600 hover:text-blue-700">
        Don't have an account? Register here
      </router-link>
    </div>

    <div v-if="error" class="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/api.js'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = ref({
  email: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  const authStore = useAuthStore();
  try {
    const token = localStorage.getItem(`${form.value.email}`);
    console.log('token for login is: ', token);
    if (token) {
      console.log('token exists');
      console.log('token', token);
      console.log('Routing to dashboard');
      authStore.setUserEmail(form.value.email);
      await router.push('/dashboard')
      // return
    }
    else {
      const response = await apiService.login(form.value.email);
      localStorage.setItem(`${form.value.email}`, response.token);
    }
    // const response = await apiService.login(form.value)

    // localStorage.setItem('ocr-api-key', response.token)
    // localStorage.setItem('userEmail', form.value.email)

    await router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Login failed. Please check your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Fallback styles to ensure button is visible */
button[type="submit"] {
  display: block !important;
  visibility: visible !important;
  background-color: #2563eb !important;
  color: white !important;
  border: none !important;
  cursor: pointer !important;
}

button[type="submit"]:hover {
  background-color: #1d4ed8 !important;
}

button[type="submit"]:disabled {
  background-color: #60a5fa !important;
  cursor: not-allowed !important;
}
</style>