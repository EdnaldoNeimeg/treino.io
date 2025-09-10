import 'iconify-icon';
import './assets/main.css'

import { defineCustomElement } from 'vue'
import { createPinia } from 'pinia'
import { vueDefineCustomElement } from './createCustomElement'
import App from './App.ce.vue'


const pinia = createPinia()
const plugins = [pinia]
const AppElement = vueDefineCustomElement(App, { plugins })

customElements.define('image-annotator', AppElement)

// SE DESCOMENTAR ISSO, NÃO PRECISA USAR A TAG CUSTOMIZADA NO HTML
// document.body.appendChild(new AppElement())