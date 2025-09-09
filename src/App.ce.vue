<template>
    <div class="relative flex flex-col items-center justify-center h-full overflow-hidden">
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
                            <span>×</span>
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
        <div
            v-if="ready"
            class="absolute cursor-initial top-1/2 -translate-y-1/2 w-56 bg-white z-10 border border-slate-200 rounded p-4 shadow-lg text-xs transition-all duration-500 opacity-0 pointer-events-none -right-16"

            :class="{
                'opacity-100! pointer-events-auto! right-2!': 
                (
                    activeObject &&
                    activeObject.id !== 'drawingArea' &&
                    activeObject.class !== 'resize-handle'
                ) || (
                    activeTool === 'draw' ||
                    activeTool === 'rectangle' ||
                    activeTool === 'circle' ||
                    activeTool === 'line' ||
                    activeTool === 'arrow'
                )
            }"
        >
            <template v-if="activeObject && (activeTool === null || activeTool === 'select')">
                <div class="flex flex-col gap-2 border-b border-slate-200 pb-4 mb-4">
                    <div class="flex items-center justify-between text-xs">
                        <div>Escala:</div>
                        <div>
                            <!-- uniform scale -->
                            <button
                                class="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 cursor-pointer"
                                @click="objectUniformScale = !objectUniformScale"
                            >
                                <!-- lock outline icon -->
                                <iconify-icon
                                    :icon="objectUniformScale ? 'material-symbols:lock-outline' : 'material-symbols:lock-open-right-outline'" class="w-5 h-5 inline-block"></iconify-icon>
                            </button>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="flex items-center">
                            <div
                                class="h-8 w-8 flex items-center justify-center"
                            >X:</div>
                            <div class="w-full flex items-center justify-end">
                                <input
                                    type="number"
                                    :value="objectScaleX"
                                    min="0.1"
                                    max="2"
                                    step="0.05"
                                    class="w-16 bg-slate-100 rounded h-6 text-center border border-slate-200 p-1"
                                    @input="objectScaleChangedInput($event, 'x')"
                                />
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div
                                class="h-8 w-8 flex items-center justify-center"
                            >Y:</div>
                            <div class="w-full flex items-center justify-end">
                                <input
                                    type="number"
                                    :value="objectScaleY"
                                    min="0.1"
                                    max="2"
                                    step="0.05"
                                    class="w-16 bg-slate-100 rounded h-6 text-center border border-slate-200 p-1"
                                    @input="objectScaleChangedInput($event, 'y')"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2 border-b border-slate-200 pb-4 mb-4">
                    <div class="flex items-center justify-between text-xs">
                        <div>Opacidade:</div>
                        <div>{{ objectOpacity * 100 }}%</div>
                    </div>
                    <div class="">
                        <input
                            type="range"
                            class="w-full h-1 mb-6 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
                            min="0"
                            max="1"
                            step="0.1"
                            v-model="objectOpacity"
                        >
                    </div>
                </div>
            </template>
            <template v-if="activeTool === 'draw'">
                <div class="flex flex-col gap-2 border-b border-slate-200 pb-4 mb-4">
                    <div class="flex items-center justify-between text-xs">
                        <div>Espessura:</div>
                        <div>{{ objectStrokeWidthMultiplier }}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="">
                            <input
                                type="range"
                                class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer range-sm  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:w-[12px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500"
                                min="2"
                                max="10"
                                step="2"
                                v-model="objectStrokeWidthMultiplier"
                            >
                        </div>
                        <div class="flex items-center justify-between text-xs">
                            <div
                                v-for="value in [2, 4, 6, 8, 10]"
                                :key="value"
                                class="flex gap-4 items-center justify-center text-xs"
                                :class="['w-[10px]']"
                            >
                                <div
                                    class="rounded-full aspect-square bg-slate-700"
                                    :style="{
                                        width: `${value}px`,
                                        height: `${value}px`
                                    }"
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <template v-if="activeTool === 'draw'">
                <div class="flex flex-col gap-2 border-b border-slate-200 pb-4 mb-4">
                    <div class="flex items-center justify-between text-xs">
                        <div>Cor:</div>
                        <div>{{ freeDrawingBrushColor }}</div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ColorSelector
                            v-model="freeDrawingBrushColor"
                            @close="closeColorPicker"
                        />
                    </div>
                </div>
            </template>
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

import ColorSelector from '@/components/ColorSelector.vue';

import Arrow from '@/fabricClasses/Arrow.js';

// import { useRangeInput } from '@/composables/useRangeInput.js';
// const rangeInput = useRangeInput();

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

const ready = ref(false);

// Variáveis para zoom suave com mouse wheel
let wheelZoomTimeout = null;

// 2. VARIÁVEIS DE REFERÊNCIA

const canvasContainer = ref(null);
const canvasWrapper = ref(null);

// 'canvasEl' é uma referência direta ao elemento <canvas> no template.
// O Vue irá conectar esta variável ao elemento que tem ref="canvasEl".
const canvasEl = ref(null);
// 'fabricCanvas' guardará a instância do Fabric.js para podermos manipular o canvas.
let fabricCanvas = null

const showWatermark = ref(true);
let watermarkImage = '/logo-comprido-escuro.png';
const watermark = ref(null);
const baseScale = 0.08; // Escala base da marca d'água

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

const activeObject = ref();
const objectScaleX = ref(1);
const objectScaleY = ref(1);
const objectUniformScale = ref(true); // Escala uniforme (X e Y juntos)
const objectOpacity = ref(1);

const watchObjectScale = ref(true);

// Variáveis para o histórico de ações (Undo/Redo)
const undoStack = ref([]);
const redoStack = ref([]);
const maxHistorySize = 50; // Limite de ações no histórico
let isRestoring = false; // Flag para evitar que o estado seja salvo durante uma restauração
let isDrawingAreaUpdating = false; // Flag para evitar loops entre input e redimensionamento manual

const displayMode = ref('ltr'); // 'ltr' (left-to-right) ou 'ttb' (top-to-bottom)
const activeTool = ref(null); // Ferramenta ativa (ex: 'draw', 'select', etc.)

// Variáveis para o pincel de desenho livre
const baseBrushWidth = ref(1); // Largura base do pincel
const objectStrokeWidthMultiplier = ref(3); // Multiplicador da largura do pincel
const freeDrawingBrushColor = ref('#F57C00'); // Cor do pincel de desenho livre

const handlersColor = '#d1d5d9';
const handlersColorOver = '#c0c4c8';

// 3. CICLO DE VIDA 'onMounted'
// O código dentro do 'onMounted' só executa *depois* que o componente foi montado na página.
// Isso é crucial, pois garante que o elemento <canvas> já existe no DOM para que o
// Fabric.js possa controlá-lo.
onMounted(async () => {
    // Inicializa o Fabric.js, associando-o ao nosso elemento canvas.
    fabricCanvas = new Canvas(canvasEl.value, {
        preserveObjectStacking: true, // Permite que objetos fiquem acima de outros
    });

    window.fabricCanvas = fabricCanvas;

    // Configurar eventos do Fabric.js
    setupFabricEvents();

    // Chama a função para carregar as imagens.
    await loadImages();
    await addDrawingArea();
    await adjustCanvasSize();
    await addClipPaths();
    saveCanvasState(); // Salva o estado inicial

    // Adiciona listener para redimensionamento da janela
    window.addEventListener('resize', adjustCanvasSize);

    // Configura os atalhos de teclado para Undo/Redo
    setupKeyboardShortcuts();

    // Configura os listeners para salvar o estado do canvas
    setupCanvasStateListeners();

    addWatermark();
    // Ativa a ferramenta de seleção por padrão
    activateSelectionMode();
    addDrawingAreaHandlers();
    
    // const arrow = new Arrow({
    //     x1: 50,
    //     y1: 50,
    //     x2: 60,
    //     y2: 60,
    //     stroke: 'blue',
    //     strokeWidth: 3,
    // });
    // fabricCanvas.add(arrow);

    setTimeout(() => {
       ready.value = true; 
    }, 500);
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

watch(activeObject, (newObj) => {
    if (newObj) {
        objectScaleX.value = parseFloat(newObj.scaleX.toFixed(2));
        objectScaleY.value = parseFloat(newObj.scaleY.toFixed(2));
        objectOpacity.value = parseFloat(newObj?.opacity)?.toFixed(2);
    }
});

watch(objectScaleX, (newScale) => {
    if(watchObjectScale.value === false) return;

    if (activeObject.value && !isNaN(newScale) && newScale > 0) {

        const ratio = activeObject.value.scaleY / activeObject.value.scaleX;
        let scaleY = activeObject.value.scaleY;

        if(objectUniformScale.value) {
            objectScaleY.value = newScale * ratio;
            scaleY = newScale * ratio;
        }

        activeObject.value.set({
            scaleX: newScale,
            scaleY: scaleY,
        });
        activeObject.value.setCoords();
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(objectScaleY, (newScale) => {
    if(watchObjectScale.value === false)  return;
    
    if (activeObject.value && !isNaN(newScale) && newScale > 0) {

        const ratio = activeObject.value.scaleX / activeObject.value.scaleY;
        let scaleX = activeObject.value.scaleX;

        if(objectUniformScale.value) {
            objectScaleX.value = newScale * ratio;
            scaleX = newScale * ratio;
        }

        activeObject.value.set({
            scaleX: scaleX,
            scaleY: newScale
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(objectOpacity, (newOpacity) => {
    if (activeObject.value && !isNaN(newOpacity) && newOpacity >= 0 && newOpacity <= 1) {
        activeObject.value.set({
            opacity: newOpacity
        });
        fabricCanvas.requestRenderAll();
        saveCanvasState();
    }
});

watch(objectStrokeWidthMultiplier, (newWidth) => {
    if (activeTool.value === 'draw' && fabricCanvas.freeDrawingBrush) {
        objectStrokeWidthMultiplier.value = Math.max(1, Math.min(newWidth, 11)); // Limita entre 1 e 11

        updateBrushWidth();
    }
});

watch(freeDrawingBrushColor, (newColor) => {
    if (activeTool.value === 'draw' && fabricCanvas.freeDrawingBrush) {
        fabricCanvas.freeDrawingBrush.color = newColor;
        fabricCanvas.requestRenderAll();
        console.log('Cor do pincel atualizada para:', newColor);
        
    }
});

// 4. FUNÇÕES PRINCIPAIS

function objectScaleChangedInput(event, axis) {
    const value = parseFloat(event.target.value).toFixed(2);
    if (!isNaN(value) && value > 0) {
        watchObjectScale.value = true;
    } else {
        watchObjectScale.value = false;
    }

    if (axis === 'x') {
        objectScaleX.value = value;
    } else if (axis === 'y') {
        objectScaleY.value = value;
    }
}

async function addDrawingArea() {
    if (!firstClipPath.value || !secondClipPath.value) return;

    // Remove área de desenho existente, se houver
    if (drawingArea.value) {
        fabricCanvas.remove(drawingArea.value);
        drawingArea.value = null;
    }

    // Calcula dimensões baseadas nos clipPaths
    const totalWidth = firstClipPath.value.width + secondClipPath.value.width;
    const maxHeight = Math.max(firstClipPath.value.height, secondClipPath.value.height);
    
    // Posição inicial no centro da área dos clipPaths (já que usamos originX/Y center)
    const centerX = firstClipPath.value.left + totalWidth / 2;
    const centerY = firstClipPath.value.top + maxHeight / 2;

    // Cria o retângulo da área de desenho
    const drawingAreaRect = new Rect({
        left: centerX,
        top: centerY,
        width: totalWidth,
        height: maxHeight,
        fill: 'white', // Fundo branco para a área de desenho
        stroke: 'oklch(67.72% 0.103 40.38)', // Cor da borda azul
        borderColor: 'oklch(67.72% 0.103 40.38)',
        cornerColor: 'orange',
        strokeWidth: 2,
        strokeUniform: true,
        selectable: false,
        evented: true,
        id: 'drawingArea',
        absolutePositioned: true,
        resizeByCorners: true,
        lockUniScaling: false,
        hasControls: true,
        hasBorders: true,
        cornerSize: 8,
        transparentCorners: false,
        borderColor: '#007ACC',
        cornerColor: '#007ACC',
        cornerStrokeColor: '#ffffff',
        lockRotation: true, // Impede rotação, apenas redimensionamento
        lockMovementX: true, // Impede movimento horizontal
        lockMovementY: true, // Impede movimento vertical
        centeredScaling: true, // Redimensionamento centralizado
        originX: 'center', // Origem X no centro
        originY: 'center', // Origem Y no centro
        perPixelTargetFind: false,
        
    });

    drawingArea.value = drawingAreaRect;
    drawingAreaWidth.value = totalWidth;
    drawingAreaHeight.value = maxHeight;

    // Adiciona ao canvas
    fabricCanvas.add(drawingAreaRect);
    fabricCanvas.sendObjectToBack(drawingAreaRect);
    
    // Armazena a referência
    drawingArea.value = drawingAreaRect;
    
    // Adiciona listener para atualizar os inputs quando redimensionado
    drawingAreaRect.on('scaling', () => {
        if (!isDrawingAreaUpdating) {
            isDrawingAreaUpdating = true;
            const newWidth = Math.round(drawingAreaRect.width * drawingAreaRect.scaleX);
            const newHeight = Math.round(drawingAreaRect.height * drawingAreaRect.scaleY);
            drawingAreaWidth.value = newWidth;
            drawingAreaHeight.value = newHeight;
            
            // Redimensiona os clipPaths em tempo real
            updateClipPathsSize();
            
            // Atualiza a posição da watermark em tempo real
            updateWatermarkPosition();
            
            isDrawingAreaUpdating = false;
        }
    });

    drawingAreaRect.on('modified', () => {
        if (!isDrawingAreaUpdating) {
            isDrawingAreaUpdating = true;
            const newWidth = Math.round(drawingAreaRect.width * drawingAreaRect.scaleX);
            const newHeight = Math.round(drawingAreaRect.height * drawingAreaRect.scaleY);
            drawingAreaWidth.value = newWidth;
            drawingAreaHeight.value = newHeight;
            
            // Normaliza o objeto para manter apenas width/height sem escala
            drawingAreaRect.set({
                width: newWidth,
                height: newHeight,
                scaleX: 1,
                scaleY: 1
            });
            
            // Redimensiona os clipPaths para seguir o drawingArea
            updateClipPathsSize();
            
            // Atualiza a posição da watermark após redimensionamento
            updateWatermarkPosition();
            
            fabricCanvas.requestRenderAll();
            isDrawingAreaUpdating = false;
        }
    });
    
    fabricCanvas.requestRenderAll();
}

/**
 * Redimensiona os clipPaths baseado nas dimensões do drawingArea
 */
function updateClipPathsSize() {
    if (!drawingArea.value || !firstClipPath.value || !secondClipPath.value) return;

    const drawingAreaWidth = drawingArea.value.width;
    const drawingAreaHeight = drawingArea.value.height;
    const drawingAreaLeft = drawingArea.value.left - (drawingAreaWidth / 2); // Ajusta para originX: center
    const drawingAreaTop = drawingArea.value.top - (drawingAreaHeight / 2); // Ajusta para originY: center

    // First clipPath ocupa metade esquerda
    firstClipPath.value.set({
        left: drawingAreaLeft,
        top: drawingAreaTop,
        width: drawingAreaWidth / 2,
        height: drawingAreaHeight
    });

    // Second clipPath ocupa metade direita
    secondClipPath.value.set({
        left: drawingAreaLeft + (drawingAreaWidth / 2),
        top: drawingAreaTop,
        width: drawingAreaWidth / 2,
        height: drawingAreaHeight
    });

    fabricCanvas.requestRenderAll();
}

/**
 * Atualiza as dimensões da área de desenho baseado nos inputs do usuário
 */
function updateDrawingAreaDimensions(oldValues, newValues) {
    if (!drawingArea.value || !fabricCanvas || isDrawingAreaUpdating) return;

    isDrawingAreaUpdating = true;

    const newWidth = parseInt(newValues[0]) || 0;
    const newHeight = parseInt(newValues[1]) || 0;

    if (newWidth <= 0 || newHeight <= 0) {
        isDrawingAreaUpdating = false;
        return;
    }

    // Atualiza as dimensões da área de desenho
    drawingArea.value.set({
        width: newWidth,
        height: newHeight,
        scaleX: 1,
        scaleY: 1
    });

    fabricCanvas.requestRenderAll();
    
    // Redimensiona os clipPaths para seguir o drawingArea
    updateClipPathsSize();
    
    // Atualiza a posição da watermark
    updateWatermarkPosition();
    
    // Salva o estado após a modificação
    saveCanvasState();
    
    isDrawingAreaUpdating = false;
}

/**
 * Salva o estado atual do canvas no histórico (undo stack).
 */
function saveCanvasState() {
    if (isRestoring) return; // Não salva se estiver restaurando um estado

    // Limpa a pilha de refazer (redo stack) sempre que uma nova ação é feita
    redoStack.value = [];

    // Serializa o canvas para JSON, incluindo propriedades personalizadas
    const state = fabricCanvas.toJSON(['id', 'clipPath', 'selectable', 'evented', 'absolutePositioned']);

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

    fabricCanvas.loadFromJSON(state, () => {
        // Após carregar, reatribui as referências dos clipPaths e imagens
        fabricCanvas.getObjects().forEach(obj => {
            if (obj.clipPath) {
                // A referência do clipPath precisa ser re-associada
                const clipPathId = fabricCanvas.getObjects().indexOf(obj.clipPath);
                if (clipPathId > -1) {
                    obj.clipPath = fabricCanvas.getObjects()[clipPathId];
                }
            }
        });

        // Reatribui as referências principais
        firstImage.value = fabricCanvas.getObjects().find(o => o.src === props.imgLeftSrc);
        secondImage.value = fabricCanvas.getObjects().find(o => o.src === props.imgRightSrc);
        firstClipPath.value = firstImage.value?.clipPath;
        secondClipPath.value = secondImage.value?.clipPath;

        fabricCanvas.requestRenderAll();
        isRestoring = false; // Desativa a flag
    });
}

/**
 * Configura os listeners de eventos do canvas para salvar o estado automaticamente.
 */
function setupCanvasStateListeners() {
    fabricCanvas.on({
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
        'selection:created': (e) => {
            console.log('Selection created:', e.selected);
            if (e.selected.length > 1) {
                fabricCanvas.discardActiveObject();
            } else {
                manageSelection(e.selected[0]);
            }
        },
        'selection:updated': (e) => {
            console.log('Selection updated:', e.selected);
            if (e.selected.length > 1) {
                fabricCanvas.discardActiveObject();
            } else {
                manageSelection(e.selected[0]);
            }
        },
        'selection:cleared': () => {
            manageSelection(null);
        },
        'object:scaling': (e) => {
            const obj = e.target;
            watchObjectScale.value =false

            objectScaleX.value = obj.scaleX.toFixed(2);
            objectScaleY.value = obj.scaleY.toFixed(2);
        },
    });
}

/**
 * Configura os atalhos de teclado para as funções de desfazer e refazer.
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', handleKeyDown);
}

function manageSelection(object) {
    activeObject.value = object;
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
 * Adicionar handlers para redimensionamento da área de desenho
*/
function addDrawingAreaHandlers() {
    if (!drawingArea.value) return;

    const commonProps = {
        hasBorders: false,
        fill: handlersColor,
        strokeWidth: 1,
        stroke: 'transparent',
        originX: 'center',
        originY: 'center',
        hasControls: false,
        hasBorders: false,
        selectable: true,
        class: 'resize-handle',
    };

    const leftHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left - drawingArea.value.width / 2,
        top: drawingArea.value.top,
        width: 10,
        height: drawingArea.value.height + 10,
        id: 'leftHandle',
        lockMovementY: true,
        hoverCursor: 'ew-resize',
    });

    const rightHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left + drawingArea.value.width / 2,
        top: drawingArea.value.top,
        width: 10,
        height: drawingArea.value.height + 10,
        id: 'rightHandle',
        class: 'resize-handle',
        lockMovementY: true,
        hoverCursor: 'ew-resize',
    });

    const topHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left,
        top: drawingArea.value.top - drawingArea.value.height / 2,
        width: drawingArea.value.width + 10,
        height: 10,
        id: 'topHandle',
        lockMovementX: true,
        hoverCursor: 'ns-resize',
    });

    const bottomHandle = new Rect({
        ...commonProps,
        left: drawingArea.value.left,
        top: drawingArea.value.top + drawingArea.value.height / 2,
        width: drawingArea.value.width + 10,
        height: 10,
        id: 'bottomHandle',
        lockMovementX: true,
        hoverCursor: 'ns-resize',
    });

    fabricCanvas.add(leftHandle);
    fabricCanvas.add(rightHandle);
    fabricCanvas.add(topHandle);
    fabricCanvas.add(bottomHandle);
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
        fabricCanvas.zoomToPoint(centerPoint, currentZoom);
      } else {
        fabricCanvas.setZoom(currentZoom);
      }
      
      zoomLevel.value = currentZoom;
      
      fabricCanvas.requestRenderAll();

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
      
      fabricCanvas.viewportTransform = currentTransform;
      fabricCanvas.requestRenderAll();
      
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
    const currentZoom = fabricCanvas.getZoom();
    if (currentZoom < min || currentZoom > max) {
      const newZoom = Math.min(Math.max(currentZoom, min), max);
      fabricCanvas.setZoom(newZoom);
      zoomLevel.value = newZoom;
      fabricCanvas.requestRenderAll();
    }
  }
}

/**
 * Define o nível de zoom diretamente com animação suave
 */
async function setZoom(level, animate = true) {
  const targetZoom = Math.min(Math.max(level, minZoom.value), maxZoom.value);
  const currentZoom = fabricCanvas.getZoom();

  if (animate && targetZoom !== currentZoom) {
    await animateZoom(currentZoom, targetZoom, 300);
  } else {
    fabricCanvas.setZoom(targetZoom);
    zoomLevel.value = targetZoom;
    fabricCanvas.requestRenderAll();
  }
}

/**
 * Reseta o zoom para 1x (100%) e centraliza o canvas com animação suave
 */
async function resetZoom() {
  const targetZoom = Math.min(Math.max(1, minZoom.value), maxZoom.value);
  const currentZoom = fabricCanvas.getZoom();
  const currentTransform = [...fabricCanvas.viewportTransform];
  const targetTransform = [1, 0, 0, 1, 0, 0];
  
  // Anima o zoom e o viewport em paralelo
  await Promise.all([
    animateZoom(currentZoom, targetZoom, 400),
    animateViewportTransform(currentTransform, targetTransform, 400)
  ]);
}

/**
 * Faz zoom in (aumenta o zoom) com animação suave
 */
async function zoomIn(factor = 1.2) {
  const currentZoom = fabricCanvas.getZoom();
  const newZoom = Math.min(currentZoom * factor, maxZoom.value);
  
  if (newZoom !== currentZoom) {
    await animateZoom(currentZoom, newZoom, 250);
  }
}

/**
 * Faz zoom out (diminui o zoom) com animação suave
 */
async function zoomOut(factor = 1.2) {
  const currentZoom = fabricCanvas.getZoom();
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

  const canvasWidth = fabricCanvas.getWidth();
  const canvasHeight = fabricCanvas.getHeight();

  

  // Calcula o zoom necessário para caber as duas imagens
  const totalImageWidth = firstImage.value.getScaledWidth() + secondImage.value.getScaledWidth();
  const maxImageHeight = Math.max(firstImage.value.getScaledHeight(), secondImage.value.getScaledHeight());
  
  const scaleX = canvasWidth / totalImageWidth;
  const scaleY = canvasHeight / maxImageHeight;
  const targetZoom = Math.min(Math.max(Math.min(scaleX, scaleY), minZoom.value), maxZoom.value);

  const currentZoom = fabricCanvas.getZoom();
  const currentTransform = [...fabricCanvas.viewportTransform];
  const targetTransform = [1, 0, 0, 1, 0, 0];
  
  // Anima o zoom e reseta o viewport
  await Promise.all([
    animateZoom(currentZoom, targetZoom, 500),
    animateViewportTransform(currentTransform, targetTransform, 500)
  ]);
  
  // Atualiza a área de desenho após ajustar o zoom
  addDrawingArea();
}

function setupFabricEvents() {
    if (!fabricCanvas) return;

    fabricCanvas.on('mouse:wheel', function (opt) {
        const delta = opt.e.deltaY;
        const currentZoom = fabricCanvas.getZoom();
        
        // Calcula o novo nível de zoom com incrementos mais suaves
        const zoomStep = delta > 0 ? 0.9 : 1.1;
        let newZoom = currentZoom * zoomStep;
        newZoom = Math.min(Math.max(newZoom, minZoom.value), maxZoom.value);
        
        // Se o zoom não mudou (limite atingido), não faz nada
        if (newZoom === currentZoom) {
            opt.e.preventDefault();
            opt.e.stopPropagation();
            return;
        }

        // Obtém as coordenadas do mouse em relação ao canvas (viewport coordinates)
        const canvasRect = fabricCanvas.upperCanvasEl.getBoundingClientRect();
        const mouseX = opt.e.clientX - canvasRect.left;
        const mouseY = opt.e.clientY - canvasRect.top;
        
        // Converte para coordenadas do world space (canvas coordinates)
        const vpt = fabricCanvas.viewportTransform;
        const worldX = (mouseX - vpt[4]) / vpt[0];
        const worldY = (mouseY - vpt[5]) / vpt[3];
        
        // Calcula o novo viewport transform para manter o ponto sob o mouse fixo
        const newVpt = [...vpt];
        
        // Atualiza a escala
        newVpt[0] = newZoom;
        newVpt[3] = newZoom;
        
        // Ajusta a translação para manter o ponto sob o mouse na mesma posição na tela
        newVpt[4] = mouseX - worldX * newZoom;
        newVpt[5] = mouseY - worldY * newZoom;
        
        // Aplica a transformação
        fabricCanvas.setViewportTransform(newVpt);
        
        zoomLevel.value = newZoom;

        opt.e.preventDefault();
        opt.e.stopPropagation();

        fabricCanvas.requestRenderAll();
    });

    // Desabilita a seleção de grupo com clique e arraste para evitar conflitos
    fabricCanvas.selection = false;

    // Configurar pan (arrastar para mover visualização) quando zoom > 1
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    fabricCanvas.on('mouse:down', function (opt) {
        const evt = opt.e;
        // Pan com botão do meio do mouse (button 1) ou Alt + clique esquerdo ou zoom > 1
        if (evt.button === 1 || evt.altKey === true) {
            isDragging = true;
            fabricCanvas.selection = false;
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
            fabricCanvas.setCursor('grab');

            // Previne o comportamento padrão do botão do meio (scroll)
            if (evt.button === 1) {
                evt.preventDefault();
            }
        }
    });

    fabricCanvas.on('mouse:move', function (opt) {
        if (isDragging) {
            const evt = opt.e;
            const vpt = fabricCanvas.viewportTransform;
            vpt[4] += evt.clientX - lastPosX;
            vpt[5] += evt.clientY - lastPosY;
            fabricCanvas.requestRenderAll();
            lastPosX = evt.clientX;
            lastPosY = evt.clientY;
            fabricCanvas.setCursor('grabbing');
        }
    });

    fabricCanvas.on('mouse:up', function () {
        if (isDragging) {
            fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
            isDragging = false;
            fabricCanvas.selection = true;
            fabricCanvas.setCursor('default');
        }
    });

    fabricCanvas.on('mouse:over', function (opt) {
        const target = opt.target;
        if (target?.class === 'resize-handle') {
            // change object's fill color on hover
            target.set('fill', handlersColorOver);
            fabricCanvas.bringObjectToFront(target);
            fabricCanvas.requestRenderAll();
        }
    });

    fabricCanvas.on('mouse:out', function (opt) {
        const target = opt.target;
        if (target?.class === 'resize-handle') {
            // revert object's fill color when not hovering
            target.set('fill', handlersColor);
            fabricCanvas.requestRenderAll();
        }
    });

    // Previne o menu de contexto ao usar o botão do meio
    fabricCanvas.upperCanvasEl.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });

    // Previne o comportamento de scroll padrão do botão do meio
    fabricCanvas.upperCanvasEl.addEventListener('mousedown', function (e) {
        if (e.button === 1) {
            e.preventDefault();
        }
    });
    
    // Adiciona listener para manter as imagens centralizadas quando movidas
    fabricCanvas.on('object:moving', function(e) {
        const obj = e.target;
        if (obj === firstImage.value || obj === secondImage.value) {
            // Permite movimento mas recentraliza após um pequeno delay
            setTimeout(() => {
                centerImagesInClipPaths();
            }, 10);
        }

        if( obj.class === 'resize-handle' ) {
            if (obj.id === 'leftHandle' || obj.id === 'rightHandle') {
                const drawingAreaObj = fabricCanvas.getObjects().find(o => o.id === 'drawingArea');
                if (drawingAreaObj) {
                    const newWidth = (Math.abs(obj.left - drawingAreaObj.left) * 2);
                    drawingAreaWidth.value = Math.round(newWidth);
                }

                if(obj.id === 'leftHandle') {
                    const rightHandle = fabricCanvas.getObjects().find(o => o.id === 'rightHandle');
                    // adjust right handle position
                    if (rightHandle) {
                        rightHandle.set({ left: drawingAreaObj.left + (drawingAreaObj.width / 2) });
                        rightHandle.setCoords();
                    }
                } else if (obj.id === 'rightHandle') {
                    const leftHandle = fabricCanvas.getObjects().find(o => o.id === 'leftHandle');
                    // adjust left handle position
                    if (leftHandle) {
                        leftHandle.set({ left: drawingAreaObj.left - (drawingAreaObj.width / 2) });
                        leftHandle.setCoords();
                    }
                }

                // adjust top and bottom handles width
                const topHandle = fabricCanvas.getObjects().find(o => o.id === 'topHandle');
                const bottomHandle = fabricCanvas.getObjects().find(o => o.id === 'bottomHandle');
                if (topHandle) {
                    topHandle.set({ width: drawingAreaObj.width + 10 });
                    topHandle.setCoords();
                }
                if (bottomHandle) {
                    bottomHandle.set({ width: drawingAreaObj.width });
                    bottomHandle.setCoords();
                }
            }

            if (obj.id === 'topHandle' || obj.id === 'bottomHandle') {
                const drawingAreaObj = fabricCanvas.getObjects().find(o => o.id === 'drawingArea');
                if (drawingAreaObj) {
                    const newHeight = Math.abs(obj.top - drawingAreaObj.top) * 2;
                    drawingAreaHeight.value = Math.round(newHeight);
                }

                if(obj.id === 'topHandle') {
                    const bottomHandle = fabricCanvas.getObjects().find(o => o.id === 'bottomHandle');
                    // adjust bottom handle position
                    if (bottomHandle) {
                        bottomHandle.set({ top: drawingAreaObj.top + (drawingAreaObj.height / 2) });
                        bottomHandle.setCoords();
                    }
                } else if (obj.id === 'bottomHandle') {
                    const topHandle = fabricCanvas.getObjects().find(o => o.id === 'topHandle');
                    // adjust top handle position
                    if (topHandle) {
                        topHandle.set({ top: drawingAreaObj.top - (drawingAreaObj.height / 2) });
                        topHandle.setCoords();
                    }
                }

                // adjust left and right handles height
                const leftHandle = fabricCanvas.getObjects().find(o => o.id === 'leftHandle');
                const rightHandle = fabricCanvas.getObjects().find(o => o.id === 'rightHandle');
                if (leftHandle) {
                    leftHandle.set({ height: drawingAreaObj.height + 10 });
                    leftHandle.setCoords();
                }
                if (rightHandle) {
                    rightHandle.set({ height: drawingAreaObj.height + 10 });
                    rightHandle.setCoords();
                }
            }
        }
    });
}

/**
 * Centraliza as imagens dentro de seus respectivos clipPaths
 */
function centerImagesInClipPaths() {
    if (!firstImage.value || !secondImage.value || !firstClipPath.value || !secondClipPath.value) return;

    const canvasWidth = fabricCanvas.getWidth();
    const canvasHeight = fabricCanvas.getHeight();

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

    fabricCanvas.renderAll();
}

function addClipPaths() {
    // clips paths must be one on left and one on right. They must be rectangles that touch in the middle
    if (firstImage.value && secondImage.value) {
        const canvasWidth = fabricCanvas.getWidth();
        const canvasHeight = fabricCanvas.getHeight();

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

        // fabricCanvas.add(clipPath1);
        // fabricCanvas.add(clipPath2);

        fabricCanvas.requestRenderAll();

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
        fabricCanvas.setDimensions({
            width: canvasWidth,
            height: canvasHeight,
        });

        // set slate background for canvas
        fabricCanvas.backgroundColor = '#F1F5F9';

        // Adiciona as imagens ao canvas.
        // O Fabric trata cada item como um objeto que pode ser movido, rotacionado, etc.
        fabricCanvas.add(imgLeft.set({ 
            left: 0, 
            top: 0, 
            evented: true, 
            selectable: true, 
            centeredScaling: true,
        }));
        fabricCanvas.add(imgRight.set({ 
            left: imgLeft.width * scale, 
            top: 0, 
            evented: true, 
            selectable: true, 
            centeredScaling: true,
        }));

        applyControlStyles(imgLeft, imgRight);

        // set images
        firstImage.value = imgLeft;
        secondImage.value = imgRight;

        fabricCanvas.renderAll();
    });
}

function adjustCanvasSize() {
    if (fabricCanvas) {
        const container = canvasWrapper.value;
        console.log({
            containerWidth: container ? container.clientWidth : 'N/A',
            containerHeight: container ? container.clientHeight : 'N/A',
            canvasWidth: fabricCanvas.width,
            canvasHeight: fabricCanvas.height,
        });
        
        if (container) {
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Define o tamanho do canvas para não ultrapassar o container
            fabricCanvas.setDimensions({
                width: containerWidth,
                height: containerHeight
            });

            fabricCanvas.renderAll();
            
            // Atualiza a área de desenho após redimensionar
            addDrawingArea();
        }
    }
}

/**
 * Atualiza a largura do pincel baseada no nível de zoom
 */
function updateBrushWidth() {
    if (fabricCanvas && fabricCanvas.freeDrawingBrush) {
        const adjustedWidth = objectStrokeWidthMultiplier.value * baseBrushWidth.value;
        fabricCanvas.freeDrawingBrush.width = adjustedWidth;
    }
}

// Aplica estilos personalizados aos controles de transformação dos objetos
function applyControlStyles(...objects) {
    objects.forEach(obj => {
        obj.set({
            borderColor: '#F95E16',
            cornerColor: '#F97316',
            cornerStyle: 'circle',
            cornerSize: 10,
            transparentCorners: false,
            hasControls: true,
            hasBorders: true
        });
    });
}

/**
 * Ativa o modo de desenho livre do Fabric.js.
 */
function activateDrawingMode() {
    if (fabricCanvas) {
        fabricCanvas.isDrawingMode = true;
        fabricCanvas.selection = false; // Desabilita seleção no modo de desenho
        fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
        fabricCanvas.freeDrawingBrush.color = freeDrawingBrushColor.value;
        updateBrushWidth(); // Aplica a largura inicial do pincel
    }
}

/**
 * Desativa o modo de desenho, voltando ao modo padrão de seleção de objetos.
 */
function activateSelectionMode() {
    activeTool.value = 'select';
    if (fabricCanvas) {
        fabricCanvas.isDrawingMode = false;
        fabricCanvas.selection = true; // Habilita seleção quando ferramenta de seleção está ativa
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
    if (!showWatermark.value || !fabricCanvas) return;

    const existingWatermark = fabricCanvas.getObjects().find(obj => obj.id === 'watermark');
    if (existingWatermark) {
        watermark.value = existingWatermark;
        existingWatermark.set({
            opacity: 0.6,
        });
        fabricCanvas.bringObjectToFront(existingWatermark);
        updateWatermarkPosition();
        fabricCanvas.requestRenderAll();
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
        });

        // Armazena a referência da marca d'água
        watermark.value = watermarkObj;

        // Posiciona usando a função de viewport
        updateWatermarkPosition();

        fabricCanvas.add(watermarkObj);
        fabricCanvas.bringObjectToFront(watermarkObj);
        fabricCanvas.requestRenderAll();
    });
}

async function toggleWatermark() {
    showWatermark.value = !showWatermark.value;
    if (showWatermark.value) {
        await addWatermark();
    } else {
        // Remove a marca d'água
        fabricCanvas.overlayImage = null;
        fabricCanvas.requestRenderAll();
    }
}

/**
 * Atualiza a posição da marca d'água para sempre ficar no canto inferior direito do drawingArea
 */
function updateWatermarkPosition() {
    if (!fabricCanvas || !watermark.value || !drawingArea.value) return;
    
    const margin = 10; // Margem reduzida para ficar dentro do drawingArea
    
    // Calcula as coordenadas do drawingArea (considerando que tem originX/Y: center)
    const drawingAreaWidth = drawingArea.value.width;
    const drawingAreaHeight = drawingArea.value.height;
    const drawingAreaLeft = drawingArea.value.left - (drawingAreaWidth / 2);
    const drawingAreaTop = drawingArea.value.top - (drawingAreaHeight / 2);
    const drawingAreaRight = drawingAreaLeft + drawingAreaWidth;
    const drawingAreaBottom = drawingAreaTop + drawingAreaHeight;
    
    // Posiciona a watermark no canto inferior direito do drawingArea
    const watermarkWidth = watermark.value.width * (baseScale);
    const watermarkHeight = watermark.value.height * (baseScale);
    
    const viewportX = drawingAreaRight - watermarkWidth - margin;
    const viewportY = drawingAreaBottom - watermarkHeight - margin;
    
    // Atualiza posição e escala da marca d'água
    watermark.value.set({
        left: viewportX,
        top: viewportY,
        scaleX: baseScale, // Compensa o zoom
        scaleY: baseScale  // Compensa o zoom
    });
    
    fabricCanvas.renderAll();
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