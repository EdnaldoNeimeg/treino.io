<template>
  <!-- Área de Comparação com FabricJS -->
  <div class="relative bg-gray-100 overflow-hidden h-[90dvh]">
    <div 
      ref="canvasContainer"
      class="relative w-full h-full flex items-center justify-center"
    >
      <canvas 
        ref="fabricCanvasElement"
        class="border border-gray-300 shadow-lg"
      ></canvas>

      <!-- Linha divisória -->
      <div 
        v-if="sliderPosition !== null"
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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Canvas, FabricImage, Rect } from 'fabric';

// Define um nome de componente multi-palavra para atender a regra de lint
defineOptions({ name: 'ImageCompare' });

const props = defineProps({
  imagesToCompare: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.first && value.second;
    }
  }
});

// Referências do componente
const canvasContainer = ref(null);
const fabricCanvasElement = ref(null);
const sliderPosition = ref(50); // Posição inicial do slider (50% = meio)
const isDragging = ref(false);

// Instâncias do FabricJS
let fabricCanvas = null;
let firstImage = null;
let secondImage = null;
let secondClipPath = null;

// Função para inicializar o canvas FabricJS
async function initCanvas() {
  if (!fabricCanvasElement.value || !canvasContainer.value) return;

  // Cria o canvas FabricJS
  fabricCanvas = new Canvas(fabricCanvasElement.value, {
    selection: false,
    backgroundColor: '#F1F5F9',
    preserveObjectStacking: true,
    renderOnAddRemove: false,
  });

  // Adiciona listeners para atualizar o clipPath quando as imagens forem manipuladas
  fabricCanvas.on('object:moving', handleImageTransform);
  fabricCanvas.on('object:scaling', handleImageTransform);
  fabricCanvas.on('object:modified', handleImageTransform);

  // Carrega as imagens
  await loadImages();
}
// Função para carregar as imagens a partir de blobs
async function loadImages() {
  if (!fabricCanvas || !canvasContainer.value || !props.imagesToCompare) return;

  // Limpa o canvas antes de carregar novas imagens
  fabricCanvas.clear();
  firstImage = null;
  secondImage = null;
  secondClipPath = null;

  const firstImageUrl = URL.createObjectURL(props.imagesToCompare.first);
  const secondImageUrl = URL.createObjectURL(props.imagesToCompare.second);

  try {
    const [imgFirst, imgSecond] = await Promise.all([
      FabricImage.fromURL(firstImageUrl, { crossOrigin: 'anonymous' }),
      FabricImage.fromURL(secondImageUrl, { crossOrigin: 'anonymous' })
    ]);

    // Obtém as dimensões do container
    const containerWidth = canvasContainer.value.clientWidth;
    const containerHeight = canvasContainer.value.clientHeight;

    // Calcula a escala para ajustar as imagens ao container
    // Agora as imagens ficam sobrepostas, não lado a lado
    const imageAspectRatio = imgFirst.width / imgFirst.height;
    const containerAspectRatio = containerWidth / containerHeight;

    let scale;
    if (imageAspectRatio > containerAspectRatio) {
      // A imagem é mais larga que o container
      scale = containerWidth / imgFirst.width; // Removido o *2, pois as imagens ficam sobrepostas
    } else {
      // A imagem é mais alta que o container
      scale = containerHeight / imgFirst.height;
    }
    scale = Math.min(scale, 1); // Não aumenta a imagem, apenas reduz se necessário

    // Define o tamanho do canvas (tamanho de uma imagem, já que estão sobrepostas)
    const canvasWidth = imgFirst.width * scale;
    const canvasHeight = imgFirst.height * scale;
    fabricCanvas.setDimensions({ width: canvasWidth, height: canvasHeight });

    // Aplica a escala e configura as imagens
    // IMPORTANTE: A primeira imagem (antes) fica POR BAIXO à esquerda
    imgFirst.set({
      scaleX: scale,
      scaleY: scale,
      id: 'firstImage',
      selectable: true,
      evented: true,
      lockRotation: true,
      lockScalingFlip: true,
      hasControls: true,
      hasBorders: true,
      cornerSize: 10,
      transparentCorners: false,
      cornerColor: '#2196F3',
      cornerStrokeColor: '#fff',
      borderColor: '#2196F3',
      borderScaleFactor: 2,
    });

    // A segunda imagem (depois) fica POR CIMA à direita com clipPath
    imgSecond.set({
      scaleX: scale,
      scaleY: scale,
      id: 'secondImage',
      selectable: true,
      evented: true,
      lockRotation: true,
      lockScalingFlip: true,
      hasControls: true,
      hasBorders: true,
      cornerSize: 10,
      transparentCorners: false,
      cornerColor: '#4CAF50',
      cornerStrokeColor: '#fff',
      borderColor: '#4CAF50',
      borderScaleFactor: 2,
    });

    // Adiciona as imagens ao canvas na ordem correta
    // Primeira (antes) é adicionada primeiro para ficar por baixo
    fabricCanvas.add(imgFirst, imgSecond);

    // Remove o controle de rotação (mtr) das imagens
    imgFirst.setControlsVisibility({
      mtr: false, // Remove o controle de rotação
    });

    imgSecond.setControlsVisibility({
      mtr: false, // Remove o controle de rotação
    });

    // Armazena as referências
    firstImage = imgFirst;
    secondImage = imgSecond;

    // Cria os clipPaths
    createClipPaths();

    // Posiciona as imagens
    positionImages();

    // Atualiza o clip path inicial
    updateClipPath();

    fabricCanvas.renderAll();

  } catch (error) {
    console.error('Erro ao carregar imagens a partir de blobs:', error);
  } finally {
    // Revoga as URLs dos objetos para liberar memória
    URL.revokeObjectURL(firstImageUrl);
    URL.revokeObjectURL(secondImageUrl);
  }
}

// Função para criar os clipPaths (baseada no App.ce.vue)
async function createClipPaths() {
  if (!firstImage || !secondImage) return;

  const imageWidth = firstImage.getScaledWidth();
  const imageHeight = firstImage.getScaledHeight();

  // Cria clipPath para a segunda imagem (que fica por cima)
  // O clipPath começa na posição do slider e vai até o final da imagem (direita)
  secondClipPath = new Rect({
    left: imageWidth / 2, // Inicialmente no meio
    top: 0,
    width: imageWidth / 2, // Inicialmente mostra metade direita
    height: imageHeight,
    absolutePositioned: true,
    selectable: false,
    evented: false,
    opacity: 0,
    id: 'secondClipPath',
  });

  // Atribui o clipPath apenas à segunda imagem
  // A primeira imagem fica completamente visível por baixo
  firstImage.clipPath = null;
  secondImage.clipPath = secondClipPath;
}

// Função para posicionar as imagens
function positionImages() {
  if (!firstImage || !secondImage) return;

  const canvasWidth = fabricCanvas.width;
  const canvasHeight = fabricCanvas.height;

  // Ambas as imagens ficam na mesma posição (sobrepostas)
  // Centralizadas no canvas
  const imageLeft = (canvasWidth - firstImage.getScaledWidth()) / 2;
  const imageTop = (canvasHeight - firstImage.getScaledHeight()) / 2;

  // Primeira imagem (por baixo)
  firstImage.set({
    left: imageLeft,
    top: imageTop,
  });

  // Segunda imagem (por cima) - mesma posição
  secondImage.set({
    left: imageLeft,
    top: imageTop,
  });

  // Atualiza a posição do clipPath da segunda imagem
  // O clipPath começa no meio da imagem (50%) e vai até o final
  if (secondClipPath) {
    const imageWidth = firstImage.getScaledWidth();
    const sliderX = (sliderPosition.value / 100) * imageWidth;
    
    secondClipPath.set({
      left: imageLeft + sliderX,
      top: imageTop,
      width: imageWidth - sliderX,
    });
    secondClipPath.setCoords();
  }

  firstImage.setCoords();
  secondImage.setCoords();
}

// Função para atualizar o clipPath baseado no slider
function updateClipPath() {
  if (!secondClipPath || !fabricCanvas || !firstImage) return;

  const imageWidth = firstImage.getScaledWidth();
  const imageLeft = firstImage.left;
  
  // Calcula a posição do divisor (slider) dentro da imagem
  const sliderX = (sliderPosition.value / 100) * imageWidth;
  
  // O clipPath da segunda imagem começa na posição do slider e vai até o final
  // Isso faz com que a parte DIREITA da segunda imagem seja mostrada
  secondClipPath.set({
    left: imageLeft + sliderX,
    width: imageWidth - sliderX,
  });

  secondClipPath.setCoords();
  fabricCanvas.renderAll();
}

// Função chamada quando as imagens são movidas ou escaladas
function handleImageTransform(event) {
  const target = event.target;
  
  // Atualiza o clipPath se a segunda imagem foi modificada
  if (target && target.id === 'secondImage' && secondClipPath) {
    updateClipPath();
  }
  
  // Se a primeira imagem foi modificada, também precisamos atualizar o clipPath
  // pois o slider é relativo à posição da primeira imagem
  if (target && target.id === 'firstImage' && secondClipPath) {
    updateClipPath();
  }
}

// Funções de controle do slider
function startDragging(event) {
  isDragging.value = true;
  event.preventDefault();
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDragging);
}

function handleDrag(event) {
  if (!isDragging.value || !fabricCanvas) return;

  const rect = fabricCanvasElement.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
  
  sliderPosition.value = percentage;
}

function stopDragging() {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
}

function resetSlider() {
  sliderPosition.value = 50;
}

// Watchers
watch(() => sliderPosition.value, () => {
  updateClipPath();
});

watch(() => [props.firstImageSrc, props.secondImageSrc], async () => {
  if (fabricCanvas) {
    fabricCanvas.clear();
    await loadImages();
  }
});

// Lifecycle
onMounted(async () => {
  await initCanvas();
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDragging);
  
  if (fabricCanvas) {
    // Remove os event listeners do canvas
    fabricCanvas.off('object:moving', handleImageTransform);
    fabricCanvas.off('object:scaling', handleImageTransform);
    fabricCanvas.off('object:modified', handleImageTransform);
    
    fabricCanvas.dispose();
  }
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