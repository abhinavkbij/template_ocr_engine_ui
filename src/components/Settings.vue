// components/Settings.vue
<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Settings</h1>

      <!-- API Configuration -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">API Configuration</h2>

        <form @submit.prevent="saveApiSettings">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">Base URL</label>
              <input
                  v-model="apiSettings.baseUrl"
                  type="url"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://api.yourservice.com"
              />
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">API Key</label>
              <input
                  v-model="apiSettings.apiKey"
                  type="password"
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your API key"
              />
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">Login Endpoint</label>
              <input
                  v-model="apiSettings.loginEndpoint"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/auth/login"
              />
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">Register Endpoint</label>
              <input
                  v-model="apiSettings.registerEndpoint"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/auth/register"
              />
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">File Processing Endpoint</label>
              <input
                  v-model="apiSettings.processEndpoint"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/process"
              />
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">Templates Endpoint</label>
              <input
                  v-model="apiSettings.templatesEndpoint"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="/templates"
              />
            </div>
          </div>

          <div class="mt-6">
            <button
                type="submit"
                :disabled="savingApi"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium"
            >
              {{ savingApi ? 'Saving...' : 'Save API Settings' }}
            </button>

            <button
                type="button"
                @click="testConnection"
                :disabled="testing"
                class="ml-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-2 rounded-md font-medium"
            >
              {{ testing ? 'Testing...' : 'Test Connection' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Processing Settings -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-700 mb-4">Processing Settings</h2>

        <form @submit.prevent="saveProcessingSettings">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">Max File Size (MB)</label>
              <input
                  v-model.number="processingSettings.maxFileSize"
                  type="number"
                  min="1"
                  max="100"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-gray-700 text-sm font-medium mb-2">Timeout (seconds)</label>
              <input
                  v-model.number="processingSettings.timeout"
                  type="number"
                  min="30"
                  max="300"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div class="md:col-span-2">
              <label class="flex items-center">
                <input
                    v-model="processingSettings.autoRetry"
                    type="checkbox"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span class="ml-2 text-gray-700">Auto-retry failed processing</span>
              </label>
            </div>
          </div>

          <div class="mt-6">
            <button
                type="submit"
                :disabled="savingProcessing"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium"
            >
              {{ savingProcessing ? 'Saving...' : 'Save Processing Settings' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Status Messages -->
    <div v-if="statusMessage" class="bg-white rounded-lg shadow-md p-4">
      <div
          class="p-3 rounded"
          :class="statusMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
      >
        {{ statusMessage.message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiService } from '../services/api.js'

const savingApi = ref(false)
const savingProcessing = ref(false)
const testing = ref(false)
const statusMessage = ref(null)

const apiSettings = ref({
  baseUrl: '',
  apiKey: '',
  loginEndpoint: '/auth/login',
  registerEndpoint: '/auth/register',
  processEndpoint: '/process',
  templatesEndpoint: '/templates'
})

const processingSettings = ref({
  maxFileSize: 10,
  timeout: 60,
  autoRetry: true
})

onMounted(() => {
  loadSettings()
})

const loadSettings = () => {
  // Load from localStorage
  const savedApiSettings = localStorage.getItem('apiSettings')
  const savedProcessingSettings = localStorage.getItem('processingSettings')

  if (savedApiSettings) {
    apiSettings.value = { ...apiSettings.value, ...JSON.parse(savedApiSettings) }
  }

  if (savedProcessingSettings) {
    processingSettings.value = { ...processingSettings.value, ...JSON.parse(savedProcessingSettings) }
  }
}

const saveApiSettings = async () => {
  savingApi.value = true
  try {
    localStorage.setItem('apiSettings', JSON.stringify(apiSettings.value))

    // Update the API service configuration
    apiService.updateConfig(apiSettings.value)

    showStatus('API settings saved successfully!', 'success')
  } catch (error) {
    showStatus('Failed to save API settings', 'error')
  } finally {
    savingApi.value = false
  }
}

const saveProcessingSettings = async () => {
  savingProcessing.value = true
  try {
    localStorage.setItem('processingSettings', JSON.stringify(processingSettings.value))
    showStatus('Processing settings saved successfully!', 'success')
  } catch (error) {
    showStatus('Failed to save processing settings', 'error')
  } finally {
    savingProcessing.value = false
  }
}

const testConnection = async () => {
  testing.value = true
  try {
    // Test the API connection
    await apiService.testConnection()
    showStatus('Connection test successful!', 'success')
  } catch (error) {
    showStatus(`Connection test failed: ${error.message}`, 'error')
  } finally {
    testing.value = false
  }
}

const showStatus = (message, type) => {
  statusMessage.value = { message, type }
  setTimeout(() => {
    statusMessage.value = null
  }, 5000)
}
</script>