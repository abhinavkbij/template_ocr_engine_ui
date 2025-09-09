// components/Dashboard.vue
<template>
  <div class="space-y-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p class="text-gray-600">Welcome to your OCR Engine dashboard. Manage your files and templates here.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Files Processed</h3>
<!--        <p class="text-3xl font-bold text-blue-600">{{ stats.totalFiles }}</p>-->
        <p class="text-3xl font-bold text-blue-600">{{ 4 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Active Templates</h3>
<!--        <p class="text-3xl font-bold text-green-600">{{ stats.totalTemplates }}</p>-->
        <p class="text-3xl font-bold text-green-600">{{ 5 }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-2">Success Rate</h3>
<!--        <p class="text-3xl font-bold text-purple-600">{{ stats.successRate }}%</p>-->
        <p class="text-3xl font-bold text-purple-600">{{ 6 }}%</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <router-link
            to="/upload"
            class="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-center transition-colors"
        >
          <div class="text-blue-600 font-semibold">Upload Files</div>
          <div class="text-sm text-gray-600 mt-1">Process new documents</div>
        </router-link>

        <router-link
            to="/templates"
            class="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
        >
          <div class="text-green-600 font-semibold">Manage Templates</div>
          <div class="text-sm text-gray-600 mt-1">Create and edit templates</div>
        </router-link>

        <router-link
            to="/settings"
            class="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
        >
          <div class="text-purple-600 font-semibold">Settings</div>
          <div class="text-sm text-gray-600 mt-1">Configure API endpoints</div>
        </router-link>
      </div>
    </div>

    <!-- Recent Files -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Files</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">File Name</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Template Used</th>
            <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Date</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
          <tr v-for="file in recentFiles" :key="file.id">
            <td class="px-4 py-2 text-sm text-gray-900">{{ file.name }}</td>
            <td class="px-4 py-2">
                <span :class="statusClass(file.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ file.status }}
                </span>
            </td>
            <td class="px-4 py-2 text-sm text-gray-600">{{ file.template || 'None' }}</td>
            <td class="px-4 py-2 text-sm text-gray-600">{{ formatDate(file.date) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiService } from '../services/api.js'

const stats = ref({
  totalFiles: 0,
  totalTemplates: 0,
  successRate: 0
})

const recentFiles = ref([])

onMounted(async () => {
  try {
    const [statsData, filesData] = await Promise.all([
        null
      // apiService.getStats(),
      // apiService.getRecentFiles()
    ])

    stats.value = null // statsData
    recentFiles.value = null // filesData
  } catch (error) {
    console.error('Error loading dashboard data:', error)
  }
})

const statusClass = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800'
    case 'processing': return 'bg-yellow-100 text-yellow-800'
    case 'failed': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>