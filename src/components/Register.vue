<template>
  <div class="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
    <h2 class="text-2xl font-bold text-center text-gray-800 mb-8">Register</h2>

    <form @submit.prevent="handleRegister">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 text-sm font-medium mb-2">First Name</label>
          <input
              v-model="form.firstName"
              type="text"
              required
              class="w-full px-4 text-black py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your first name"
          />
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
          <input
              v-model="form.lastName"
              type="text"
              required
              class="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your last name"
          />
        </div>
      </div>

      <div class="mb-4">
        <label class="block  text-gray-700 text-sm font-medium mb-2">Email</label>
        <input
            v-model="form.email"
            type="email"
            required
            class="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
        />
      </div>

      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">Organization</label>
        <input
            v-model="form.organization"
            type="text"
            required
            class="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your organization"
        />
      </div>

      <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-md font-medium transition-colors border-0"
          style="min-height: 48px; display: block !important; background-color: #2563eb !important;"
      >
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </button>
    </form>

  </div>
</template>

// ... existing code ...

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '../services/api.js'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  organization: ''
})

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await apiService.register(form.value)

    console.log('response from apiService.register is: ', response);
    // console.log('response.json is: ', response);
    // const jsonResponse = await response.json();
    // console.log('jsonResponse is: ', jsonResponse);
    if (response.api_key) {
      const authStore = useAuthStore();
      const emailToPass = form.value.email;
      authStore.setUserEmail(emailToPass);
      // console.log('response.api_key: ', response.api_key);
      // console.log('form.value.email: ', form.value.email);
      localStorage.setItem(`${form.value.email}`, response.api_key);
      success.value = 'Account created successfully! Please check your email for verification.';
      await router.push('/dashboard');
    } else {
      error.value = response.message || 'Registration failed. Please try again.'
      // Reset form
      form.value = {
        firstName: '',
        lastName: '',
        email: '',
        organization: ''
      }
    }
  } catch (err) {
    error.value = err.message || 'Registration failed. Please try again.'
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

/* Responsive grid adjustments */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>