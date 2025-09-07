<template>
    <div class="relative flex flex-col items-center justify-center h-full">
        <div class="w-full absolute z-20 top-2 left-1/2 -translate-x-1/2 flex items-center justify-between px-2">
            <div class="">

            </div>
            <div class="grow flex items-center justify-center gap-4">
                <div class="flex items-center justify-center gap-2">
                    <div class="flex items-center gap-3 p-1.5 rounded-md shadow-xl bg-white">
                        <div class="flex items-center justify-center gap-2">
                            <input
                                type="text"
                                v-model="drawingAreaWidth"
                                placeholder="Largura"
                                class="w-14 h-8 text-sm text-center border border-slate-200 rounded p-1 bg-slate-100"
                            >
                            <span>X</span>
                            <input
                                type="text"
                                v-model="drawingAreaHeight"
                                placeholder="Altura"
                                class="w-14 h-8 text-sm text-center border border-slate-200 rounded p-1 bg-slate-100"
                            >
                        </div>
                        <div class="h-6 border-r border-slate-300"></div>
                        <div class="flex items-center justify-center gap-2">
                            <div class="flex items-center overflow-hidden">
                                <button
                                    @click="zoomOut()"
                                    class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-l transition-colors">
                                    <iconify-icon icon="material-symbols:remove" class="inline-block"></iconify-icon>
                                </button>
                                <span class="flex items-center border-y border-slate-200 justify-center text-sm bg-slate-100 h-8 font-medium min-w-[50px] text-center">{{ Math.round(zoomLevel * 100) }}%</span>
                                <button
                                    @click="zoomIn()"
                                    class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-r transition-colors">
                                    <iconify-icon icon="material-symbols:add" class="inline-block"></iconify-icon>
                                </button>
                            </div>
                            <button
                                @click="fitToCanvas()"
                                class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors">
                                <iconify-icon icon="carbon:fit-to-screen" class="inline-block"></iconify-icon>
                            </button>
                        </div>
                        <div class="h-6 border-r border-slate-300"></div>
                        <div class="flex items-center">
                            <button
                                @click="displayMode = 'ltr'"
                                class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-l transition-colors"
                                :class="{ 'bg-primary-500! text-white': displayMode === 'ltr' }"
                            >
                                <iconify-icon icon="streamline:interface-layout-two-columns-colums-layout-layouts-two" class="inline-block"></iconify-icon>
                            </button>
                            <button
                                @click="displayMode = 'ttb'"
                                class="h-8 w-8 flex items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded-r transition-colors"
                                :class="{ 'bg-primary-500! text-white': displayMode === 'ttb' }"
                            >
                                <iconify-icon icon="streamline:interface-layout-two-columns-colums-layout-layouts-two" class="rotate-90 inline-block"></iconify-icon>
                            </button>
                        </div>
                        <div class="h-6 border-r border-slate-300"></div>
                        <div class="flex items-center gap-2">
                            <button @click="setActiveTool('select')"
                                class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': activeTool === 'select' || activeTool === null }"
                            >
                                <iconify-icon icon="iconamoon:cursor-fill" class="text-sm inline-block"></iconify-icon>
                                <span class="text-xs absolute bottom-0.5 right-1">
                                    <small>1</small>
                                </span>
                            </button>
                            <button @click="setActiveTool('draw')"
                                class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': activeTool === 'draw' }"
                            >
                                <iconify-icon icon="streamline:pen-draw" class="text-sm inline-block"></iconify-icon>
                                <span class="text-xs absolute bottom-0.5 right-1">
                                    <small>2</small>
                                </span>
                            </button>
                            <button @click="setActiveTool('rectangle')"
                                class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': activeTool === 'rectangle' }"
                            >
                                <iconify-icon icon="ic:outline-square" class="text-sm inline-block"></iconify-icon>
                                <span class="text-xs absolute bottom-0.5 right-1">
                                    <small>3</small>
                                </span>
                            </button>
                            <button @click="setActiveTool('circle')"
                                class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': activeTool === 'circle' }"
                            >
                                <iconify-icon icon="mdi:checkbox-blank-circle-outline" class="text-sm inline-block"></iconify-icon>
                                <span class="text-xs absolute bottom-0.5 right-1">
                                    <small>4</small>
                                </span>
                            </button>
                            <button @click="setActiveTool('line')"
                                class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': activeTool === 'line' }"
                            >
                                <iconify-icon icon="garden:dash-stroke-16" class="inline-block -rotate-45"></iconify-icon>
                                <span class="text-sm absolute bottom-0.5 right-1">
                                    <small>5</small>
                                </span>
                            </button>
                            <button @click="setActiveTool('arrow')"
                                class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': activeTool === 'arrow' }"
                            >
                                <iconify-icon icon="material-symbols-light:line-start-arrow-notch-rounded" class="text-lg inline-block -rotate-45"></iconify-icon>
                                <span class="text-sm absolute bottom-0.5 right-1">
                                    <small>6</small>
                                </span>
                            </button>
                            <button @click="setActiveTool('eraser')"
                                class="h-8 w-8 relative pb-1.5 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                                :class="{ 'bg-primary-500! text-white': activeTool === 'eraser' }"
                            >
                                <iconify-icon icon="lineicons:eraser" class="text-sm inline-block"></iconify-icon>
                                <span class="text-xs absolute bottom-0.5 right-1">
                                    <small>7</small>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="shrink">
                <div class="bg-white rounded p-1 5 shadow-xl">
                    <button @click="toggleWatermark()"
                        class="h-8 w-8 flex flex-col items-center justify-center bg-slate-100 hover:bg-primary-500 hover:text-white text-black rounded transition-colors"
                        :class="{ 'bg-primary-500! text-white': showWatermark }"
                    >
                        <iconify-icon icon="mdi-light:bookmark" class="text-lg inline-block"></iconify-icon>
                    </button>
                </div>
            </div>

        </div>

        <div class="grow flex items-center justify-center w-full bg-[url(@/assets/image.png)] bg-size-[800px]">
            <div ref="canvasContainer" class="max-h-full overflow-auto w-full h-full flex items-center justify-center">
                <div ref="canvasWrapper" class="relative w-full h-full bg-red-500">
                    <canvas ref="canvasEl"></canvas>
                </div>
                <div class="absolute flex items-center justify-between bottom-2 left-1/2 transform -translate-x-1/2">
                    <div class="flex items-center rounded shadow-xl bg-white">
                        <button
                            @click="undo()"
                            :disabled="undoStack.length <= 1"
                            class="h-8 w-8 flex items-center justify-center bg-slate-200 hover:bg-primary-500 hover:text-white text-black rounded-l transition-colors">
                            <iconify-icon icon="iconoir:undo" class="inline-block"></iconify-icon>
                        </button>
                        <button
                            @click="redo()"
                            :disabled="redoStack.length === 0"
                            class="h-8 w-8 flex items-center justify-center bg-slate-200 hover:bg-primary-500 hover:text-white text-black rounded-r transition-colors">
                            <iconify-icon icon="iconoir:redo" class="inline-block"></iconify-icon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Canvas, FabricImage, Rect, PencilBrush, classRegistry } from 'fabric'

import Arrow from '@/fabricClasses/Arrow.js';

classRegistry.setClass(Arrow);

// === DOCUMENTAÇÃO DO SCRIPT ===

// 1. DEFINIÇÃO DAS PROPRIEDADES (PROPS)
// 'defineProps' declara os dados que o componente espera receber do HTML.
// Nosso componente precisa das URLs de duas imagens.
const props = defineProps({
    imgLeftSrc: {
        type: String,
        required: true,
    },
    imgRightSrc: {
        type: String,
        required: true,
    },
});

// Variáveis para zoom suave com mouse wheel
let wheelZoomTimeout = null;

// 2. VARIÁVEIS DE REFERÊNCIA

const canvasContainer = ref(null);
const canvasWrapper = ref(null);

// 'canvasEl' é uma referência direta ao elemento <canvas> no template.
// O Vue irá conectar esta variável ao elemento que tem ref="canvasEl".
const canvasEl = ref(null);
// 'fabricCanvas' guardará a instância do Fabric.js para podermos manipular o canvas.
const fabricCanvas = ref(null);

const showWatermark = ref(true);
let watermarkImage = 'public/logo-comprido-escuro.png';
const watermark = ref(null);
const baseScale = 0.2; // Escala base da marca d'água

const firstImage = ref(null);
const firstClipPath = ref(null);
const secondImage = ref(null);
const secondClipPath = ref(null);
const drawingArea = ref(null); // Área de desenho (retângulo transparente)
const zoomLevel = ref(1);
const maxZoom = ref(4.5);
const minZoom = ref(0.5);

const drawingAreaWidth = ref(0);
const drawingAreaHeight = ref(0);

// Variáveis para o histórico de ações (Undo/Redo)
const undoStack = ref([]);
const redoStack = ref([]);
const maxHistorySize = 50; // Limite de ações no histórico
let isRestoring = false; // Flag para evitar que o estado seja salvo durante uma restauração

const displayMode = ref('ltr'); // 'ltr' (left-to-right) ou 'ttb' (top-to-bottom)
const activeTool = ref(null); // Ferramenta ativa (ex: 'draw', 'select', etc.)

// Variáveis para o pincel de desenho livre
const baseBrushWidth = 2.5; // Largura base do pincel

// 3. CICLO DE VIDA 'onMounted'
// O código dentro do 'onMounted' só executa *depois* que o componente foi montado na página.
// Isso é crucial, pois garante que o elemento <canvas> já existe no DOM para que o
// Fabric.js possa controlá-lo.
onMounted(async () => {
    // Inicializa o Fabric.js, associando-o ao nosso elemento canvas.
    fabricCanvas.value = new Canvas(canvasEl.value, {
        preserveObjectStacking: true, // Permite que objetos fiquem acima de outros
    });

    window.fabricCanvas = fabricCanvas.value;

    // Configurar zoom com mouse wheel
    setupZoom();

    // Chama a função para carregar as imagens.
    setTimeout(async () => {
        await loadImages();
        await addDrawingArea();
        await adjustCanvasSize();
        await addClipPaths();
        saveCanvasState(); // Salva o estado inicial
    }, 10);

    // Adiciona listener para redimensionamento da janela
    window.addEventListener('resize', adjustCanvasSize);

    // Configura os atalhos de teclado para Undo/Redo
    setupKeyboardShortcuts();

    // Configura os listeners para salvar o estado do canvas
    setupCanvasStateListeners();

    setTimeout(() => {
        addWatermark();
        // Ativa a ferramenta de seleção por padrão
        activateSelectionMode();
    }, 300);

    // const arrow = new Arrow({
    //     x1: 50,
    //     y1: 50,
    //     x2: 60,
    //     y2: 60,
    //     stroke: 'blue',
    //     strokeWidth: 3,
    // });
    // fabricCanvas.value.add(arrow);
});

// Limpa o listener quando o componente for desmontado
onUnmounted(() => {
    window.removeEventListener('resize', adjustCanvasSize);
    document.removeEventListener('keydown', handleKeyDown);
});

// Watchers para atualizar a área de desenho quando as dimensões mudarem
watch([drawingAreaWidth, drawingAreaHeight], ( 
    newValues,
    oldValues
) => {
    updateDrawingAreaDimensions(oldValues, newValues);
}, { deep: true });

// 4. FUNÇÕES PRINCIPAIS

async function addDrawingArea() {
    if (!firstClipPath.value || !secondClipPath.value) return;

    // Remove área de desenho existente, se houver
    if (drawingArea.value) {
        fabricCanvas.value.remove(drawingArea.value);
        drawingArea.value = null;
    }

    // Calcula dimensões baseadas nos clipPaths
    const totalWidth = firstClipPath.value.width + secondClipPath.value.width;
    const maxHeight = Math.max(firstClipPath.value.height, secondClipPath.value.height);
    
    // Posição inicial no ponto (0,0) do primeiro clipPath
    const startX = firstClipPath.value.left;
    const startY = firstClipPath.value.top;

    // Cria o retângulo da área de desenho
    const drawingAreaRect = new Rect({
        left: startX,
        top: startY,
        width: totalWidth,
        height: maxHeight,
        fill: 'transparent',
        stroke: '#007ACC', // Cor da borda azul
        strokeWidth: 2,
        strokeDashArray: [5, 5], // Borda tracejada
        selectable: false,
        evented: false,
        id: 'drawingArea',
        absolutePositioned: true,
    });

    drawingArea.value = drawingAreaRect;
    drawingAreaWidth.value = totalWidth;
    drawingAreaHeight.value = maxHeight;

    // Adiciona ao canvas
    fabricCanvas.value.add(drawingAreaRect);
    fabricCanvas.value.bringToFront(drawingAreaRect);
    
    // Armazena a referência
    drawingArea.value = drawingAreaRect;
    
    fabricCanvas.value.requestRenderAll();
}

/**
 * Atualiza as dimensões da área de desenho baseado nos inputs do usuário
 */
function updateDrawingAreaDimensions(oldValues, newValues) {
    
    if (!drawingArea.value || !fabricCanvas.value) return;

    const oldWidth = parseInt(oldValues[0]) || 0;
    const oldHeight = parseInt(oldValues[1]) || 0;

    const newWidth = parseInt(newValues[0]) || 0;
    const newHeight = parseInt(newValues[1]) || 0;

    const differenceWidth = oldWidth > 0 ? newWidth - oldWidth : 0;
    const differenceHeight = oldHeight > 0 ? newHeight - oldHeight : 0;

    if (newWidth <= 0 || newHeight <= 0) return;

    // Atualiza as dimensões da área de desenho
    drawingArea.value.set({
        width: newWidth,
        height: newHeight,
        top: drawingArea.value.top - differenceHeight / 2,
        left: drawingArea.value.left - differenceWidth / 2,
    });

    fabricCanvas.value.requestRenderAll();
    
    // Salva o estado após a modificação
    saveCanvasState();
}

/**
 * Salva o estado atual do canvas no histórico (undo stack).
 */
function saveCanvasState() {
    if (isRestoring) return; // Não salva se estiver restaurando um estado

    // Limpa a pilha de refazer (redo stack) sempre que uma nova ação é feita
    redoStack.value = [];

    // Serializa o canvas para JSON, incluindo propriedades personalizadas
    const state = fabricCanvas.value.toJSON(['id', 'clipPath', 'selectable', 'evented', 'absolutePositioned']);

    // Adiciona o estado à pilha de desfazer
    undoStack.value.push(state);

    // Limita o tamanho do histórico para não consumir muita memória
    if (undoStack.value.length > maxHistorySize) {
        undoStack.value.shift(); // Remove o estado mais antigo
    }
}

/**
 * Desfaz a última ação (Ctrl+Z).
 */
function undo() {
    if (undoStack.value.length <= 1) return; // Mantém o estado inicial na pilha

    // Move o estado atual da pilha de desfazer para a de refazer
    const currentState = undoStack.value.pop();
    redoStack.value.push(currentState);

    // Pega o estado anterior
    const previousState = undoStack.value[undoStack.value.length - 1];
    
    // Restaura o canvas para o estado anterior
    restoreCanvasState(previousState);
}

/**
 * Refaz a última ação desfeita (Ctrl+Shift+Z).
 */
function redo() {
    if (redoStack.value.length === 0) return;

    // Move o estado da pilha de refazer de volta para a de desfazer
    const stateToRestore = redoStack.value.pop();
    undoStack.value.push(stateToRestore);

    // Restaura o canvas para este estado
    restoreCanvasState(stateToRestore);
}

/**
 * Restaura o canvas a partir de um objeto de estado JSON.
 */
function restoreCanvasState(state) {
    isRestoring = true; // Ativa a flag para não salvar este estado novamente

    fabricCanvas.value.loadFromJSON(state, () => {
        // Após carregar, reatribui as referências dos clipPaths e imagens
        fabricCanvas.value.getObjects().forEach(obj => {
            if (obj.clipPath) {
                // A referência do clipPath precisa ser re-associada
                const clipPathId = fabricCanvas.value.getObjects().indexOf(obj.clipPath);
                if (clipPathId > -1) {
                    obj.clipPath = fabricCanvas.value.getObjects()[clipPathId];
                }
            }
        });

        // Reatribui as referências principais
        firstImage.value = fabricCanvas.value.getObjects().find(o => o.src === props.imgLeftSrc);
        secondImage.value = fabricCanvas.value.getObjects().find(o => o.src === props.imgRightSrc);
        firstClipPath.value = firstImage.value?.clipPath;
        secondClipPath.value = secondImage.value?.clipPath;

        fabricCanvas.value.requestRenderAll();
        isRestoring = false; // Desativa a flag
    });
}

/**
 * Configura os listeners de eventos do canvas para salvar o estado automaticamente.
 */
function setupCanvasStateListeners() {
    fabricCanvas.value.on({
        'object:modified': saveCanvasState,
        'path:created': (e) => {
            const path = e?.path;
            if (path) {
                // Garante seleção precisa por pixel
                path.set({ perPixelTargetFind: true });
                // Atribui um ID único somente se ainda não houver um
                if (!path.id) {
                    const uid = `path-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
                    path.set({ id: uid });
                }
            }
            saveCanvasState();
        },
    });
}

/**
 * Configura os atalhos de teclado para as funções de desfazer e refazer.
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyDown);
}

/**
 * Manipulador de eventos de teclado.
 */
function handleKeyDown(e) {
    // Atalho para Desfazer: Ctrl+Z
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    }
    // Atalho para Refazer: Ctrl+Shift+Z ou Ctrl+Y
    if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        redo();
    }
}

/**
 * Anima o zoom suavemente de um valor para outro
 */
function animateZoom(startZoom, endZoom, duration = 300, centerPoint = null) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Função de easing (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentZoom = startZoom + (endZoom - startZoom) * easeProgress;
      
      if (centerPoint) {
        fabricCanvas.value.zoomToPoint(centerPoint, currentZoom);
      } else {
        fabricCanvas.value.setZoom(currentZoom);
      }
      
      zoomLevel.value = currentZoom;
      
      // Atualiza a largura do pincel durante a animação de zoom
      updateBrushWidth();
      
      fabricCanvas.value.requestRenderAll();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}

/**
 * Anima a transformação do viewport suavemente
 */
function animateViewportTransform(startTransform, endTransform, duration = 300) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Função de easing (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentTransform = startTransform.map((start, index) => {
        const end = endTransform[index];
        return start + (end - start) * easeProgress;
      });
      
      fabricCanvas.value.viewportTransform = currentTransform;
      fabricCanvas.value.requestRenderAll();
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };
    
    requestAnimationFrame(animate);
  });
}

/**
 * Define os limites mínimo e máximo de zoom
 */
function setZoomLimits(min, max) {
  if (min > 0 && max > min) {
    minZoom.value = min;
    maxZoom.value = max;
    
    // Garante que o zoom atual esteja dentro dos novos limites
    const currentZoom = fabricCanvas.value.getZoom();
    if (currentZoom < min || currentZoom > max) {
      const newZoom = Math.min(Math.max(currentZoom, min), max);
      fabricCanvas.value.setZoom(newZoom);
      zoomLevel.value = newZoom;
      updateBrushWidth();
      fabricCanvas.value.requestRenderAll();
    }
  }
}

/**
 * Define o nível de zoom diretamente com animação suave
 */
async function setZoom(level, animate = true) {
  const targetZoom = Math.min(Math.max(level, minZoom.value), maxZoom.value);
  const currentZoom = fabricCanvas.value.getZoom();

  if (animate && targetZoom !== currentZoom) {
    await animateZoom(currentZoom, targetZoom, 300);
  } else {
    fabricCanvas.value.setZoom(targetZoom);
    zoomLevel.value = targetZoom;
    updateBrushWidth();
    fabricCanvas.value.requestRenderAll();
  }
}

/**
 * Reseta o zoom para 1x (100%) e centraliza o canvas com animação suave
 */
async function resetZoom() {
  const targetZoom = Math.min(Math.max(1, minZoom.value), maxZoom.value);
  const currentZoom = fabricCanvas.value.getZoom();
  const currentTransform = [...fabricCanvas.value.viewportTransform];
  const targetTransform = [1, 0, 0, 1, 0, 0];
  
  // Anima o zoom e o viewport em paralelo
  await Promise.all([
    animateZoom(currentZoom, targetZoom, 400),
    animateViewportTransform(currentTransform, targetTransform, 400)
  ]);
  
  // Centraliza as imagens em seus clipPaths após a animação
  centerImagesInClipPaths();
}

/**
 * Faz zoom in (aumenta o zoom) com animação suave
 */
async function zoomIn(factor = 1.2) {
  const currentZoom = fabricCanvas.value.getZoom();
  const newZoom = Math.min(currentZoom * factor, maxZoom.value);
  
  if (newZoom !== currentZoom) {
    await animateZoom(currentZoom, newZoom, 250);
  }
}

/**
 * Faz zoom out (diminui o zoom) com animação suave
 */
async function zoomOut(factor = 1.2) {
  const currentZoom = fabricCanvas.value.getZoom();
  const newZoom = Math.max(currentZoom / factor, minZoom.value);
  
  if (newZoom !== currentZoom) {
    await animateZoom(currentZoom, newZoom, 250);
  }
}

/**
 * Ajusta o zoom para caber todo o conteúdo no canvas com animação suave
 */
async function fitToCanvas() {
if (!firstImage.value || !secondImage.value) return;
console.log('fitToCanvas');

  const canvasWidth = fabricCanvas.value.getWidth();
  const canvasHeight = fabricCanvas.value.getHeight();

  

  // Calcula o zoom necessário para caber as duas imagens
  const totalImageWidth = firstImage.value.getScaledWidth() + secondImage.value.getScaledWidth();
  const maxImageHeight = Math.max(firstImage.value.getScaledHeight(), secondImage.value.getScaledHeight());
  
  const scaleX = canvasWidth / totalImageWidth;
  const scaleY = canvasHeight / maxImageHeight;
  const targetZoom = Math.min(Math.max(Math.min(scaleX, scaleY), minZoom.value), maxZoom.value);

  const currentZoom = fabricCanvas.value.getZoom();
  const currentTransform = [...fabricCanvas.value.viewportTransform];
  const targetTransform = [1, 0, 0, 1, 0, 0];
  
  // Anima o zoom e reseta o viewport
  await Promise.all([
    animateZoom(currentZoom, targetZoom, 500),
    animateViewportTransform(currentTransform, targetTransform, 500)
  ]);
  
  // Centraliza as imagens após a animação
  centerImagesInClipPaths();
  
  // Atualiza a área de desenho após ajustar o zoom
  addDrawingArea();
}

function setupZoom() {
    if (!fabricCanvas.value) return;

    fabricCanvas.value.on('mouse:wheel', function (opt) {
        const delta = opt.e.deltaY;
        let zoom = fabricCanvas.value.getZoom();

        // Calcula o novo nível de zoom
        zoom *= 0.999 ** delta;
        zoom = Math.min(Math.max(zoom, minZoom.value), maxZoom.value);

        // Obtém a posição do ponteiro em relação ao canvas
        const pointer = fabricCanvas.value.getPointer(opt.e);

        // Para zoom com mouse wheel, mantemos a resposta rápida
        // mas podemos adicionar uma leve suavização
        clearTimeout(wheelZoomTimeout);
        
        // Aplica o zoom imediatamente para responsividade
        fabricCanvas.value.zoomToPoint({ x: pointer.x, y: pointer.y }, zoom);
        zoomLevel.value = zoom;
        
        // Atualiza a largura do pincel baseada no novo zoom
        updateBrushWidth();

        opt.e.preventDefault();
        opt.e.stopPropagation();

        fabricCanvas.value.requestRenderAll();
    });

    // Desabilita a seleção de grupo com clique e arraste para evitar conflitos
    fabricCanvas.value.selection = false;

    // Configurar pan (arrastar para mover visualização) quando zoom > 1
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    fabricCanvas.value.on('mouse:down', function (opt) {
        const evt = opt.e;
        // Pan com botão do meio do mouse (button 1) ou Alt + clique esquerdo ou zoom > 1
        if (evt.button === 1 || evt.altKey === true) {
            isDragging = true;
            fabricCanvas.value.selection = false;
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
            fabricCanvas.value.setCursor('grab');

            // Previne o comportamento padrão do botão do meio (scroll)
            if (evt.button === 1) {
                evt.preventDefault();
            }
        }
    });

    fabricCanvas.value.on('mouse:move', function (opt) {
        if (isDragging) {
            const evt = opt.e;
            const vpt = fabricCanvas.value.viewportTransform;
            vpt[4] += evt.clientX - lastPosX;
            vpt[5] += evt.clientY - lastPosY;
            fabricCanvas.value.requestRenderAll();
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
            fabricCanvas.value.setCursor('grabbing');
        }
    });

    fabricCanvas.value.on('mouse:up', function () {
        if (isDragging) {
            fabricCanvas.value.setViewportTransform(fabricCanvas.value.viewportTransform);
            isDragging = false;
            fabricCanvas.value.selection = true;
            fabricCanvas.value.setCursor('default');
        }
    });

    // Previne o menu de contexto ao usar o botão do meio
    fabricCanvas.value.upperCanvasEl.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Previne o comportamento de scroll padrão do botão do meio
    fabricCanvas.value.upperCanvasEl.addEventListener('mousedown', function (e) {
        if (e.button === 1) {
            e.preventDefault();
        }
    });
    
    // Adiciona listener para manter as imagens centralizadas quando movidas
    fabricCanvas.value.on('object:moving', function(e) {
        const obj = e.target;
        if (obj === firstImage.value || obj === secondImage.value) {
            // Permite movimento mas recentraliza após um pequeno delay
            setTimeout(() => {
                centerImagesInClipPaths();
            }, 10);
        }
    });
}

/**
 * Centraliza as imagens dentro de seus respectivos clipPaths
 */
function centerImagesInClipPaths() {
    if (!firstImage.value || !secondImage.value || !firstClipPath.value || !secondClipPath.value) return;

    const canvasWidth = fabricCanvas.value.getWidth();
    const canvasHeight = fabricCanvas.value.getHeight();

    // Área do primeiro clipPath (metade esquerda)
    const leftClipWidth = canvasWidth / 2;
    const leftClipHeight = canvasHeight;
    
    // Área do segundo clipPath (metade direita)  
    const rightClipWidth = canvasWidth / 2;
    const rightClipHeight = canvasHeight;
    
    // Centraliza a primeira imagem EXATAMENTE no centro da metade esquerda
    const img1ScaledWidth = firstImage.value.getScaledWidth();
    const img1ScaledHeight = firstImage.value.getScaledHeight();
    const img1CenterX = (leftClipWidth - img1ScaledWidth) / 2;
    const img1CenterY = (leftClipHeight - img1ScaledHeight) / 2;
    
    firstImage.value.set({
        left: img1CenterX,
        top: img1CenterY
    });
    
    // Centraliza a segunda imagem EXATAMENTE no centro da metade direita
    const img2ScaledWidth = secondImage.value.getScaledWidth();
    const img2ScaledHeight = secondImage.value.getScaledHeight();
    const img2CenterX = (canvasWidth / 2) + (rightClipWidth - img2ScaledWidth) / 2;
    const img2CenterY = (rightClipHeight - img2ScaledHeight) / 2;
    
    secondImage.value.set({
        left: img2CenterX,
        top: img2CenterY
    });

    fabricCanvas.value.renderAll();
}

function addClipPaths() {
    // clips paths must be one on left and one on right. They must be rectangles that touch in the middle
    if (firstImage.value && secondImage.value) {
        const canvasWidth = fabricCanvas.value.getWidth();
        const canvasHeight = fabricCanvas.value.getHeight();

        const clipPath1 = new Rect({
            left: 0,
            top: 0,
            width: canvasWidth / 2,
            height: canvasHeight,
            absolutePositioned: true,
            selectable: false,
            evented: false,
            opacity: 0.3,
            fill: 'red',
            id: 'firstClipPath',
        });
        
        const clipPath2 = new Rect({
            left: canvasWidth / 2,
            top: 0,
            width: canvasWidth / 2,
            height: canvasHeight,
            absolutePositioned: true,
            selectable: false,
            evented: false,
            opacity: 0.3,
            fill: 'blue',
            id: 'secondClipPath',
        });

        firstImage.value.clipPath = clipPath1;
        secondImage.value.clipPath = clipPath2;

        // fabricCanvas.value.add(clipPath1);
        // fabricCanvas.value.add(clipPath2);

        fabricCanvas.value.requestRenderAll();

        firstClipPath.value = clipPath1;
        secondClipPath.value = clipPath2;
        
        // Centraliza as imagens dentro de seus clipPaths
        centerImagesInClipPaths();
        
        // Adiciona a área de desenho após criar os clipPaths
        addDrawingArea();
    }
}

/**
 * Carrega as duas imagens das URLs fornecidas via props, calcula o tamanho
 * necessário para o canvas e as posiciona lado a lado.
 */
async function loadImages() {
    // 'FabricImage.fromURL' é uma operação assíncrona (leva um tempo para baixar a imagem).
    // 'Promise.all' é a forma ideal de executar duas ou mais operações assíncronas ao
    // mesmo tempo e esperar que todas terminem.
    await Promise.all([
        FabricImage.fromURL(props.imgLeftSrc, { crossOrigin: 'anonymous' }),
        FabricImage.fromURL(props.imgRightSrc, { crossOrigin: 'anonymous' })
    ]).then(([imgLeft, imgRight]) => {

        // Obtém as dimensões do container
        const container = canvasContainer.value;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // Calcula as dimensões totais das duas imagens lado a lado
        const totalImageWidth = imgLeft.width + imgRight.width;
        const maxImageHeight = Math.max(imgLeft.height, imgRight.height);

        // Calcula o fator de escala para caber no container
        const scaleX = containerWidth / totalImageWidth;
        const scaleY = containerHeight / maxImageHeight;
        const scale = Math.min(scaleX, scaleY, 0.85); // Não aumenta se já cabe

        // Aplica a escala às imagens
        imgLeft.scale(scale);
        imgRight.scale(scale);

        // set id for images
        imgLeft.set({ id: 'leftImage' });
        imgRight.set({ id: 'rightImage' });

        // Calcula as dimensões finais do canvas
        const canvasWidth = Math.min(totalImageWidth * scale, containerWidth);
        const canvasHeight = Math.min(maxImageHeight * scale, containerHeight);
    // const left = (containerWidth - canvasWidth) / 2;
    // const top = (containerHeight - canvasHeight) / 2;

        // Define o tamanho do canvas
        fabricCanvas.value.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        // set yellow background for canvas
        fabricCanvas.value.backgroundColor = 'white';
        fabricCanvas.value.renderAll();

        // Adiciona as imagens ao canvas.
        // O Fabric trata cada item como um objeto que pode ser movido, rotacionado, etc.
        fabricCanvas.value.add(imgLeft.set({ 
            left: 0, 
            top: 0, 
            evented: true, 
            selectable: true, 
            centeredScaling: true,
            hasControls: true,
            hasBorders: true,
            cornerSize: 10,
            transparentCorners: true
        }));
        fabricCanvas.value.add(imgRight.set({ 
            left: imgLeft.width * scale, 
            top: 0, 
            evented: true, 
            selectable: true, 
            centeredScaling: true,
            hasControls: true,
            hasBorders: true,
            cornerSize: 10,
            transparentCorners: true
        }));

        // set images
        firstImage.value = imgLeft;
        secondImage.value = imgRight;
    });
}

function adjustCanvasSize() {
    if (fabricCanvas.value) {
        const container = canvasWrapper.value;
        console.log({
            containerWidth: container ? container.clientWidth : 'N/A',
            containerHeight: container ? container.clientHeight : 'N/A',
            canvasWidth: fabricCanvas.value.width,
            canvasHeight: fabricCanvas.value.height,
        });
        
        if (container) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Define o tamanho do canvas para não ultrapassar o container
            fabricCanvas.value.setDimensions({
                width: containerWidth,
                height: containerHeight
            });

            fabricCanvas.value.renderAll();
            
            // SEMPRE centraliza as imagens após ajustar o tamanho do canvas
            centerImagesInClipPaths();
            
            // Atualiza a área de desenho após redimensionar
            addDrawingArea();
        }
    }
}

/**
 * Atualiza a largura do pincel baseada no nível de zoom
 */
function updateBrushWidth() {
    if (fabricCanvas.value && fabricCanvas.value.freeDrawingBrush) {
        const zoom = fabricCanvas.value.getZoom();
        // A largura do pincel diminui conforme o zoom aumenta
        const adjustedWidth = baseBrushWidth / zoom;
        fabricCanvas.value.freeDrawingBrush.width = adjustedWidth;
    }
}

/**
 * Ativa o modo de desenho livre do Fabric.js.
 */
function activateDrawingMode() {
    if (fabricCanvas.value) {
        fabricCanvas.value.isDrawingMode = true;
        fabricCanvas.value.selection = false; // Desabilita seleção no modo de desenho
        fabricCanvas.value.freeDrawingBrush = new PencilBrush(fabricCanvas.value);

        updateBrushWidth(); // Usa a função para definir a largura ajustada ao zoom
        fabricCanvas.value.freeDrawingBrush.color = '#ef4444'; // Cor do pincel
    }
}

/**
 * Desativa o modo de desenho, voltando ao modo padrão de seleção de objetos.
 */
function activateSelectionMode() {
    activeTool.value = 'select';
    if (fabricCanvas.value) {
        fabricCanvas.value.isDrawingMode = false;
        fabricCanvas.value.selection = true; // Habilita seleção quando ferramenta de seleção está ativa
    }
}

function setActiveTool(tool) {
    activeTool.value = tool;
    if (tool === 'draw') {
        activateDrawingMode();
    } else if(tool === 'select') {
        activateSelectionMode();
    }
}

async function addWatermark() {
    if (!showWatermark.value || !fabricCanvas.value) return;

    // find if watermark already exists
    const existingWatermark = fabricCanvas.value.getObjects().find(obj => obj.id === 'watermark');
    if (existingWatermark) {
        watermark.value = existingWatermark;
        existingWatermark.set({
            opacity: 0.6,
        });
        fabricCanvas.value.bringObjectToFront(existingWatermark);
        updateWatermarkPosition();
        fabricCanvas.value.requestRenderAll();
        return;
    }

    await Promise.all([
        FabricImage.fromURL(watermarkImage, { crossOrigin: 'anonymous' })
    ]).then(([watermarkObj]) => {
        watermarkObj.set({
            opacity: 0.6,
            selectable: false,
            evented: false,
            hoverCursor: 'default',
            id: 'watermark',
            scaleX: baseScale,
            scaleY: baseScale,
        });

        // Armazena a referência da marca d'água
        watermark.value = watermarkObj;

        // Posiciona usando a função de viewport
        updateWatermarkPosition();

        fabricCanvas.value.add(watermarkObj);
        fabricCanvas.value.bringObjectToFront(watermarkObj);
        fabricCanvas.value.requestRenderAll();
    });
}

async function toggleWatermark() {
    showWatermark.value = !showWatermark.value;
    if (showWatermark.value) {
        await addWatermark();
    } else {
        // Remove a marca d'água
        fabricCanvas.value.overlayImage = null;
        fabricCanvas.value.requestRenderAll();
    }
}

/**
 * Atualiza a posição da marca d'água para sempre ficar no canto inferior direito do viewport
 */
function updateWatermarkPosition() {
    if (!fabricCanvas.value || !watermark.value) return;
    
    const zoom = fabricCanvas.value.getZoom();
    const canvasWidth = fabricCanvas.value.getWidth();
    const canvasHeight = fabricCanvas.value.getHeight();
    
    // Posição desejada no viewport (canto inferior direito com margem)
    const margin = 20;
    // const viewportX = canvasWidth - (watermark.value.getScaledWidth() * (baseScale / zoom)) - margin;
    // const viewportY = canvasHeight - (watermark.value.getScaledHeight() * (baseScale / zoom)) - margin;
    
    // // Converte coordenadas do viewport para coordenadas do canvas
    // const canvasX = (viewportX - vpt[4]) / zoom;
    // const canvasY = (viewportY - vpt[5]) / zoom;

    const viewportX = canvasWidth - (watermark.value.width * baseScale) - margin;
    const viewportY = canvasHeight - (watermark.value.height * baseScale) - margin
    
    // Atualiza posição e escala da marca d'água
    watermark.value.set({
        left: viewportX,
        top: viewportY,
        scaleX: baseScale / zoom, // Compensa o zoom
        scaleY: baseScale / zoom  // Compensa o zoom
    });
    
    fabricCanvas.value.renderAll();
}













// Exposição de métodos para uso externo
defineExpose({
  setZoomLimits,
  setZoom,
  resetZoom,
  zoomIn,
  zoomOut,
  fitToCanvas,
  undo,
  redo,
  getZoomLevel: () => zoomLevel.value,
  getZoomLimits: () => ({ min: minZoom.value, max: maxZoom.value })
});

</script>

<style>
/* === DOCUMENTAÇÃO DO ESTILO === */
/* Como estamos usando o plugin '@tailwindcss/vite', esta única linha é suficiente
   para que o Tailwind processe as classes usadas no template e injete o CSS
   necessário dentro do Shadow DOM do web component. Isso garante que o estilo
   fique encapsulado e não vaze para o resto da página. */
@import "@/assets/main.css";


/* .canvas-container {
    width: 100% !important;
    height: 100% !important;
    position: relative;
} */
</style>