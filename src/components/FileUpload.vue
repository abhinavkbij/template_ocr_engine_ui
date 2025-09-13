<template>
  <div class="w-full space-y-6">
    <div class="flex w-xl m-auto justify-center">
    <div class="w-full bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Upload Files</h1>

      <!-- Template Selection -->
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-medium mb-2">Select Template (Optional)</label>
        <select
            v-model="selectedTemplate"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">No template (Generic extraction)</option>
          <option v-for="template in templates" :key="template" :value="template">
            {{ template }}
          </option>
        </select>
      </div>

      <!-- File Upload Area -->
      <div
          @drop="handleDrop"
          @dragover.prevent
          @dragenter.prevent
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors"
          :class="{ 'border-blue-400 bg-blue-50': dragOver }"
      >
        <div class="space-y-4">
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <div>
            <p class="text-lg text-gray-600">
              Drag and drop your files here, or
              <label class="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                browse
                <input
                    ref="fileInput"
                    type="file"
                    multiple
                    @change="handleFileSelect"
                    accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                    class="hidden"
                />
              </label>
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Supports PDF, PNG, JPG, JPEG, TIFF, BMP files
            </p>
          </div>
        </div>
      </div>

      <!-- Selected Files -->
      <div v-if="selectedFiles.length > 0" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Selected Files</h3>
        <div class="flex justify-between items-center space-y-2">
          <div
              v-for="(file, index) in selectedFiles"
              :key="index"
              class="flex w-xl justify-between bg-gray-50 rounded-lg p-3"
          >
            <div class="flex space-x-3 items-center">
              <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
              </svg>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
              </div>
            </div>
            <button
                @click="removeFile(index)"
                class="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>

        <button
            @click="uploadFiles"
            :disabled="uploading"
            class="mt-4 w-xs bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-gray-300 py-3 rounded-md font-medium transition-colors"
        >
          {{ uploading ? 'Processing...' : `Process ${selectedFiles.length} File(s)` }}
        </button>
      </div>
    </div>
    </div>

    <!-- Processing Results -->
    <div v-if="results.length > 0" class="w-full">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Processing Results</h2>
        <div class="w-full">
          <div class="json-editor-container">
            <pre class="json-editor"><code ref="codeBlock" class="language-json"></code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { apiService } from '../services/api.js'
import {useAuthStore} from "../stores/auth.js";
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';

// Register the languages you need
hljs.registerLanguage('json', json);

const selectedTemplate = ref('')
const templates = ref([])
const selectedFiles = ref([])
const uploading = ref(false)
const results = ref([])
const dragOver = ref(false)
const fileInput = ref(null)
const codeBlock = ref(null)

// Watch for changes in results and highlight the code
watch(results, async (newResults) => {
  if (newResults.length > 0) {
    await nextTick()
    if (codeBlock.value) {
      const formattedJson = JSON.stringify(newResults, null, 2)
      codeBlock.value.textContent = formattedJson
      hljs.highlightElement(codeBlock.value)
    }
  }
}, { immediate: true })


onMounted(async () => {
  try {
    templates.value = await apiService.getTemplates()
    // templates.value =
  } catch (error) {
    console.error('Error loading templates:', error)
  }
})

const handleDrop = (e) => {
  e.preventDefault()
  dragOver.value = false
  const files = Array.from(e.dataTransfer.files)
  addFiles(files)
}

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files)
  addFiles(files)
}

const addFiles = (files) => {
  const validFiles = files.filter(file => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/bmp']
    return validTypes.includes(file.type) || file.name.toLowerCase().match(/\.(pdf|png|jpg|jpeg|tiff|bmp)$/)
  })

  selectedFiles.value.push(...validFiles)
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) return

  uploading.value = true
  results.value = []

  try {
    const formData = new FormData()

    selectedFiles.value.forEach((file, index) => {
      formData.append(`file`, file)
      formData.append('type', 'png')
      formData.append('output', 'entities')
    })

    const response = await apiService.processFiles(formData)

    console.log('API Response:', response);
    console.log('API Response Entities:', response.entities);
    console.log('API Response Status:', response.status);
    results.value = response.entities || []

    // Clear selected files after successful upload
    selectedFiles.value = []
    if (fileInput.value) {
      fileInput.value.value = ''
    }

  } catch (error) {
    console.error('Error processing files:', error)
    results.value = [{
      id: 'error',
      fileName: 'Processing Error',
      status: 'error',
      error: error.message || 'Failed to process files'
    }]
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
@import 'highlight.js/styles/github.css';
</style>