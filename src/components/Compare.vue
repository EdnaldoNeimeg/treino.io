<template>
  <!-- Área de Comparação -->
  <div class="relative bg-gray-100 overflow-hidden" style="height: 60vh;">
    <!-- Container das imagens -->
    <div 
      ref="compareContainer"
      class="relative w-full h-full select-none"
      @mousedown="startDragging"
      @mousemove="handleDrag"
      @mouseup="stopDragging"
      @mouseleave="stopDragging"
    >
      <!-- Imagem de fundo (segunda imagem) -->
      <div class="absolute inset-0">
        <img
          :src="secondImageSrc"
          alt="Segunda imagem"
          class="w-full h-full object-contain"
          draggable="false"
        />
      </div>

      <!-- Imagem de frente (primeira imagem) com clip-path -->
      <div 
        class="absolute inset-0"
        :style="{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }"
      >
        <img
          :src="firstImageSrc"
          alt="Antes"
          class="w-full h-full object-contain"
          draggable="false"
        />
      </div>

      <!-- Linha divisória -->
      <div 
        class="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-10"
        :style="{ left: `${sliderPosition}%` }"
      >
        <!-- Círculo handle no meio da linha -->
        <div 
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-ew-resize flex items-center justify-center pointer-events-auto"
          @mousedown.stop="startDragging"
        >
          <iconify-icon icon="mdi:drag-horizontal" class="text-gray-600 text-sm"></iconify-icon>
        </div>
      </div>

      <!-- Labels das imagens -->
      <div class="absolute top-4 left-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
        Antes
      </div>
      <div class="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
        Depois
      </div>
    </div>
  </div>

  <!-- Footer com controles -->
  <div class="p-4 border-t border-gray-200 bg-gray-50">
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Arraste o controle deslizante para comparar as imagens
      </div>
      <div class="flex gap-2">
        <button
          @click="resetSlider"
          class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
        >
          Centralizar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';

// Define um nome de componente multi-palavra para atender a regra de lint
defineOptions({ name: 'ImageCompare' });

defineProps({
  firstImageSrc: {
    type: String,
    required: true
  },
  secondImageSrc: {
    type: String,
    required: true
  }
});

// Estados do componente
const compareContainer = ref(null);
const sliderPosition = ref(50); // Posição inicial do slider (50% = meio)
const isDragging = ref(false);

// Função para iniciar o arrastar
const startDragging = (event) => {
  isDragging.value = true;
  event.preventDefault();
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDragging);
};

// Função para lidar com o arrastar
const handleDrag = (event) => {
  if (!isDragging.value || !compareContainer.value) return;

  const rect = compareContainer.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  sliderPosition.value = percentage;
};

// Função para parar o arrastar
const stopDragging = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
};

// Função para resetar o slider para o centro
const resetSlider = () => {
  sliderPosition.value = 50;
};

// Cleanup dos event listeners
onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
});
</script>

<style scoped>
/* Estilos adicionais se necessário */
.pointer-events-none {
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}

/* Cursor personalizado para toda a área de comparação */
.select-none {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Estilo para o cursor quando não está arrastando */
.cursor-ew-resize {
  cursor: ew-resize;
}
</style>