import 'iconify-icon';
import './assets/main.css'

import { defineCustomElement } from 'vue'
import { createPinia } from 'pinia'
import { vueDefineCustomElement } from './createCustomElement'
import ImageAnnotator from './components/ImageAnnotator.ce.vue'

const pinia = createPinia()
const plugins = [pinia]
const ImageAnnotatorElement = vueDefineCustomElement(ImageAnnotator, { plugins })

customElements.define('image-annotator', ImageAnnotatorElement)

// SE DESCOMENTAR ISSO, NÃO PRECISA USAR A TAG CUSTOMIZADA NO HTML
// document.body.appendChild(new ImageAnnotatorElement())