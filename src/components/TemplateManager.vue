/ components/TemplateManager.vue
<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Template Manager</h1>
        <button
            @click="showCreateModal = true"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        >
          Create Template
        </button>
      </div>

      <!-- Templates List -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
            v-for="template in templates"
            :key="template.id"
            class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-3">
            <h3 class="font-semibold text-gray-900">{{ template.name }}</h3>
            <div class="flex space-x-2">
              <button
                  @click="editTemplate(template)"
                  class="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
              <button
                  @click="deleteTemplate(template.id)"
                  class="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>
          </div>

          <p class="text-gray-600 text-sm mb-3">{{ template.description }}</p>

          <div class="text-xs text-gray-500">
            <p>Fields: {{ template.fields ? template.fields.length : 0 }}</p>
            <p>Created: {{ formatDate(template.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Template Modal -->
    <div v-if="showCreateModal || editingTemplate" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">
            {{ editingTemplate ? 'Edit Template' : 'Create Template' }}
          </h2>
          <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveTemplate">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Template Name</label>
            <input
                v-model="templateForm.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template name"
            />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-2">Description</label>
            <textarea
                v-model="templateForm.description"
                class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template description"
                rows="3"
            ></textarea>
          </div>

          <div class="mb-6">
            <div class="flex justify-between items-center mb-4">
              <label class="block text-gray-700 text-sm font-medium">Fields</label>
              <button
                  type="button"
                  @click="addField"
                  class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Add Field
              </button>
            </div>

            <div class="space-y-3">
              <div
                  v-for="(field, index) in templateForm.fields"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label class="block text-gray-600 text-xs font-medium mb-1">Field Name</label>
                    <input
                        v-model="field.name"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="e.g., name, address"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-600 text-xs font-medium mb-1">Field Type</label>
                    <select
                        v-model="field.type"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="email">Email</option>
                    </select>
                  </div>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <label class="block text-gray-600 text-xs font-medium mb-1">X</label>
                    <input
                        v-model.number="field.coordinates.x"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-600 text-xs font-medium mb-1">Y</label>
                    <input
                        v-model.number="field.coordinates.y"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-600 text-xs font-medium mb-1">Width</label>
                    <input
                        v-model.number="field.coordinates.width"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-gray-600 text-xs font-medium mb-1">Height</label>
                    <input
                        v-model.number="field.coordinates.height"
                        type="number"
                        min="0"
                        class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div class="flex justify-end">
                  <button
                      type="button"
                      @click="removeField(index)"
                      class="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Field
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4">
            <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
                type="submit"
                :disabled="saving"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md font-medium"
            >
              {{ saving ? 'Saving...' : 'Save Template' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { apiService } from '../services/api.js'

const templates = ref([])
const showCreateModal = ref(false)
const editingTemplate = ref(null)
const saving = ref(false)

const templateForm = ref({
  name: '',
  description: '',
  fields: []
})

onMounted(async () => {
  await loadTemplates()
})

const loadTemplates = async () => {
  try {
    templates.value = await apiService.getTemplates()
  } catch (error) {
    console.error('Error loading templates:', error)
  }
}

const addField = () => {
  templateForm.value.fields.push({
    name: '',
    type: 'text',
    coordinates: { x: 0, y: 0, width: 100, height: 50 }
  })
}

const removeField = (index) => {
  templateForm.value.fields.splice(index, 1)
}

const editTemplate = (template) => {
  editingTemplate.value = template
  templateForm.value = {
    name: template.name,
    description: template.description || '',
    fields: template.fields ? JSON.parse(JSON.stringify(template.fields)) : []
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTemplate.value = null
  templateForm.value = {
    name: '',
    description: '',
    fields: []
  }
}

const saveTemplate = async () => {
  saving.value = true
  try {
    if (editingTemplate.value) {
      await apiService.updateTemplate(editingTemplate.value.id, templateForm.value)
    } else {
      await apiService.createTemplate(templateForm.value)
    }

    await loadTemplates()
    closeModal()
  } catch (error) {
    console.error('Error saving template:', error)
  } finally {
    saving.value = false
  }
}

const deleteTemplate = async (templateId) => {
  if (!confirm('Are you sure you want to delete this template?')) return

  try {
    await apiService.deleteTemplate(templateId)
    await loadTemplates()
  } catch (error) {
    console.error('Error deleting template:', error)
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}
</script>