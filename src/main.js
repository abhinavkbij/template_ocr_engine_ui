import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import components
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Dashboard from './components/Dashboard.vue'
import FileUpload from './components/FileUpload.vue'
import TemplateManager from './components/TemplateManager.vue'
import Settings from './components/Settings.vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

const pinia = createPinia();

const routes = [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: Login, name: 'login' },
    { path: '/register', component: Register, name: 'register' },
    { path: '/dashboard', component: Dashboard, name: 'dashboard', meta: { requiresAuth: true } },
    { path: '/upload', component: FileUpload, name: 'upload', meta: { requiresAuth: true } },
    { path: '/templates', component: TemplateManager, name: 'templates', meta: { requiresAuth: true } },
    { path: '/settings', component: Settings, name: 'settings', meta: { requiresAuth: true } }
]

const router = createRouter({
    history: createWebHashHistory('/template_ocr_engine_ui/'),
    routes
})

// Auth guard
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const userEmail = authStore.userEmail;
    console.log('userEmail in auth guard is: ', userEmail);
    const token = localStorage.getItem(`${userEmail}`);
    console.log('token for auth guard is: ', token);
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else if ((to.name === 'login' || to.name === 'register') && token) {
        next('/dashboard')
    } else {
        next()
    }
})

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')