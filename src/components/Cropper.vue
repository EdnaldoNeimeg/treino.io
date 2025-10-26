<template>
  <div class="flex flex-col lg:flex-row justify-center overflow-hidden bg-gray-50 h-[90vh]">
    <!-- Canvas Area -->
    <div class="flex-1 relative bg-gray-100 h-full w-[800px]" ref="canvasContainer">
      <canvas ref="fabricCanvasElement" id="cropCanvas"></canvas>
      
      <!-- Dimensions Indicator -->
      <div 
        v-if="showDimensions"
        class="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-mono"
      >
        {{ Math.round(clipWidth) }} × {{ Math.round(clipHeight) }}
      </div>

      <!-- Loading Indicator -->
      <div 
        v-if="isLoading"
        class="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <div class="text-white text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Carregando imagem...</p>
        </div>
      </div>
    </div>
    <!-- Controls Panel -->
    <div class="lg:w-80 w-full bg-white crop-controls flex-shrink-0 p-4">
      <div class="flex flex-col h-full">
        <div class="flex-1 py-3">
          <h3 class="text-gray-800 font-bold text-lg mb-4">Área de Corte</h3>

          <div class="mb-6 flex gap-4">
            <div class="mb-4">
              <label class="block mb-2 font-bold text-slate-800 text-sm">Largura</label>
              <input
                v-model.number="clipWidth"
                placeholder="Ex.: 200"
                type="number"
                min="1"
                class="text-sm bg-slate-200 rounded h-8 w-full px-2 text-gray-800"
                @input="onDimensionChange"
              />
            </div>
            <div class="mb-4">
              <label class="block mb-2 font-bold text-slate-800 text-sm">Altura</label>
              <input
                v-model.number="clipHeight"
                placeholder="Ex.: 200"
                type="number"
                min="1"
                class="text-sm bg-slate-200 rounded h-8 w-full px-2 text-gray-800"
                @input="onDimensionChange"
              />
            </div>
          </div>

          <!-- Instructions -->
          <div class="text-slate-600 text-sm mb-4">
            <p class="mb-2">• Arraste as alças para redimensionar</p>
            <p class="mb-2">• Mova a área clicando e arrastando</p>
            <p>• Use os campos acima para ajuste preciso</p>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex gap-4">
          <button
            @click="cropImage"
            class="w-full h-10 rounded bg-green-500 hover:bg-green-600 text-white font-bold transition-colors"
          >
            Cortar Imagem
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineAsyncComponent } from 'vue';
import { Canvas, Rect, FabricObject, FabricImage, StaticCanvas, Pattern } from 'fabric';

import { applyStyleToControls } from '@/composables/useControls.js';

const Tooltip = defineAsyncComponent(() => import('@/components/Tooltip.vue'));

// Define nome multi-palavra para o componente
defineOptions({ name: 'ImageCropper' });

// Props do componente
const props = defineProps({
  image: {
    type: Object, // FabricImage object
    required: true,
    validator: (value) => {
      return value && typeof value === 'object';
    }
  }
});

// Emits
const emit = defineEmits(['crop-completed', 'crop-error','image-cropped']);

// Template refs
const canvasContainer = ref(null);
const fabricCanvasElement = ref(null);

// Reactive state
const clipWidth = ref(200);
const clipHeight = ref(200);
const showDimensions = ref(true);
const isLoading = ref(false);

// Fabric instances
let croppingCanvas = null;
let croppingImg = null;
let clipPath = null;
let overlay = null;
let maxScaleX = 0;
let maxScaleY = 0;
let dimensionUpdateTimeout = null;

// Canvas initialization function (adapted from CropArea.vue)
async function setupCroppingCanvas() {
  if (!fabricCanvasElement.value || !canvasContainer.value) return;

  isLoading.value = true;

  try {
    const containerWidth = canvasContainer.value.clientWidth;
    const containerHeight = canvasContainer.value.clientHeight;

    // Create fabric canvas with v6 syntax
    croppingCanvas = new Canvas(fabricCanvasElement.value, {
      controlsAboveOverlay: true,
      selectionColor: '#FF000033',
      selectionBorderColor: '#ff6600FF',
    });

    croppingCanvas.setDimensions({
      width: containerWidth,
      height: containerHeight,
    });

    // Event handlers
    croppingCanvas.on('selection:cleared', () => {
      const clipPathObj = croppingCanvas.getObjects().find(o => o.id === 'clipPath');
      if (clipPathObj) {
        croppingCanvas.setActiveObject(clipPathObj);
      }
    });

    // MOVE
    croppingCanvas.on('object:moving', (e) => {
        if (e.target && e.target.id === 'clipPath') {
            limitClipMove(e);
        }
    });

    // SCALE
    croppingCanvas.on('object:scaling', (e) => {
        if (e.target && e.target.id === 'clipPath') {

            maxScaleX = croppingImg.getScaledWidth() / e.target.width;
            maxScaleY = croppingImg.getScaledHeight() / e.target.height;

            limitClipScale(e);

            const cw = Math.round(e.target.width * e.target.scaleX);
            const ch = Math.round(e.target.height * e.target.scaleY);

            if(cw > croppingImg.getScaledWidth()){
              console.log('Crop width exceeds image width');
            }

            if(ch > croppingImg.getScaledHeight()){
              console.log('Crop height exceeds image height');
            }
        }
    });

    croppingCanvas.on('object:modified', () => {
      updateDimensions();
    });

    await setupGridBackground(croppingCanvas);

    croppingCanvas.renderAll();

    // // Setup clipping objects first
    await setupClippingObjects();
    
    // Then setup the image
    await setupCroppingImage();
    croppingCanvas.renderAll();

  } catch (error) {
    console.error('Error setting up cropping canvas:', error);
    emit('crop-error', error);
  } finally {
    isLoading.value = false;
  }
}

async function setupGridBackground(){

  await Promise.all([
      FabricImage.fromURL('grid.jpg', { crossOrigin: 'anonymous' })
  ]).then(([img]) => {
    try {
      const patternSourceCanvas = new StaticCanvas();
      patternSourceCanvas.add(img);

      patternSourceCanvas.setDimensions({
        width: img.getScaledWidth(),
        height: img.getScaledHeight(),
      });
      
      patternSourceCanvas.renderAll();
      const b64 = patternSourceCanvas.toDataURL({ multiplier: 0.15 });

      const pattImage = new Image();
      pattImage.src = b64;

      patternSourceCanvas.toCanvasElement(1)
      .toBlob(
          (blob) => {
              if (blob){
                console.log('blob patternSourceCanvas', blob);

                const pattern = new Pattern({
                  source: pattImage,
                  scale: 0.2,
                  repeat: 'repeat'
                });

                croppingCanvas.backgroundColor = pattern;
                croppingCanvas.renderAll();
              }
              else{
                console.error('Error creating blob for grid background pattern');
              };
          },
          "image/png",
          1
      );
    } catch (error) {
      console.error('Error setting up grid background:', error);
    }
  });
}

// Setup clipping objects (adapted from CropArea.vue for v6)
async function setupClippingObjects() {
  if (!croppingCanvas) return;

  // Create clipPath (invisible rectangle for cropping area)
  clipPath = new Rect({
    id: 'clipPath',
    width: clipWidth.value,
    height: clipHeight.value,
    centeredScaling: true,
    centeredRotation: true,
    originX: 'center',
    originY: 'center',
    lockRotation: true,
    hasRotatingPoint: false,
    fill: '#f00',
    absolutePositioned: true,
    inverted: true,
    opacity: 0.0000000000000001,
  });

  applyStyleToControls(clipPath);

  croppingCanvas.add(clipPath);
  croppingCanvas.centerObject(clipPath);
  clipPath.setCoords();

  // Create overlay (dark mask with clipPath applied)
  const overlay = new Rect({
    id: 'overlay',
    selectable: false,
    fill: '#00000099',
    originX: 'center',
    originY: 'center',
    clipPath: clipPath,
    inverted: true,
    absolutePositioned: true,
  });

  // Configure visible controls (remove rotation handle)
  clipPath.setControlsVisibility({
    mt: true,
    mb: true,
    ml: true,
    mr: true,
    tr: true,
    tl: true,
    br: true,
    bl: true,
    mtr: false,
  });

  croppingCanvas.add(overlay);
  croppingCanvas.centerObject(overlay);
  overlay.setCoords();
}

// Setup cropping image (adapted from CropArea.vue for v6)
async function setupCroppingImage() {
  if (!croppingCanvas || !props.image) return;

  try {
    // Clone the provided FabricImage
    const img = await props.image.clone();
    croppingImg = img;

    const canvasRatio = croppingCanvas.width / croppingCanvas.height;
    const imgRatio = img.width / img.height;
    
    const objects = croppingCanvas.getObjects();
    const overlayObj = objects.find(o => o.id === 'overlay');
    const clipPathObj = objects.find(o => o.id === 'clipPath');

    img.set({
      originX: 'center',
      originY: 'center'
    });

    // Scale image to fit canvas
    if (canvasRatio < imgRatio) {
      img.scaleToWidth(croppingCanvas.width);
    } else {
      img.scaleToHeight(croppingCanvas.height);
    }

    // Create background clone
    const backgroundClone = await img.clone();
    backgroundClone.set({
        selectable: false,
        originX: 'center',
        originY: 'center',
        clipPath: null,
    });
    
    // Add images to canvas
    croppingCanvas.add(backgroundClone);
    croppingCanvas.add(img);
    
    // Center images
    croppingCanvas.centerObject(backgroundClone);
    croppingCanvas.centerObject(img);
    croppingCanvas.sendObjectToBack(backgroundClone);

    const imgScaledWidth = img.getScaledWidth();
    const imgScaledHeight = img.getScaledHeight();

    // Update overlay size to match image
    if (overlayObj) {
      overlayObj.set({
        width: croppingCanvas.width,
        height: croppingCanvas.height
      });
      croppingCanvas.centerObject(overlayObj);
    }

    // Apply clipPath to main image
    // img.set('clipPath', clipPathObj);
    img.set({ selectable: false });
    croppingCanvas.centerObject(img);

    // Calculate max scales for boundary checking
    if (clipPathObj) {
      maxScaleX = img.getScaledWidth() / clipPathObj.width;
      maxScaleY = img.getScaledHeight() / clipPathObj.height;
      
      croppingCanvas.setActiveObject(clipPathObj);
    }

    if (clipPathObj) {
      const initialWidth = img.getScaledWidth() * 0.75; // imgRatio >= 1 ? imgScaledHeight : imgScaledWidth;
      const initialHeight = img.getScaledHeight() * 0.75; // imgRatio >= 1 ? imgScaledHeight : imgScaledWidth;
      clipPathObj.set({
        width: initialWidth,
        height: initialHeight,
      });

      clipWidth.value = initialWidth;
      clipHeight.value = initialHeight;

      croppingCanvas.centerObject(clipPathObj);
      clipPathObj.setCoords();
    }
    croppingCanvas.renderAll();

  } catch (error) {
    console.error('Error setting up cropping image:', error);
    emit('crop-error', error);
  }
}

// Boundary checking functions (adapted from CropArea.vue)
function limitClipScale(e) {
  const target = e.target;

  if (target.scaleX > maxScaleX) {
    target.set({ scaleX: maxScaleX });
  }
  if (target.scaleY > maxScaleY) {
    target.set({ scaleY: maxScaleY });
  }

  limitClipMove({ target });
}

function limitClipMove(event) {
  const target = event.target;
  const img = croppingImg;

  if (!img) return;

  const scaledImgWidth = img.getScaledWidth();
  const scaledImgHeight = img.getScaledHeight();
  const scaledTargetWidth = target.getScaledWidth();
  const scaledTargetHeight = target.getScaledHeight();

  // Calculate image bounds
  const imgLeft = img.left - scaledImgWidth / 2;
  const imgTop = img.top - scaledImgHeight / 2;
  const imgRight = imgLeft + scaledImgWidth;
  const imgBottom = imgTop + scaledImgHeight;

  // Calculate target bounds
  const targetLeft = target.left - scaledTargetWidth / 2;
  const targetTop = target.top - scaledTargetHeight / 2;
  const targetRight = targetLeft + scaledTargetWidth;
  const targetBottom = targetTop + scaledTargetHeight;


  // Limit movement
  let newLeft = target.left;
  let newTop = target.top;

  console.log('targetLeft, imgLeft:', targetLeft, imgLeft);
  

  if (targetLeft < imgLeft) {
    newLeft = imgLeft + scaledTargetWidth / 2;
  }
  if (targetRight > imgRight) {
    newLeft = imgRight - scaledTargetWidth / 2;
  }
  if (targetTop < imgTop) {
    newTop = imgTop + scaledTargetHeight / 2;
  }
  if (targetBottom > imgBottom) {
    newTop = imgBottom - scaledTargetHeight / 2;
  }

  target.set({
    left: newLeft,
    top: newTop
  });
}

// Update dimensions function
function updateDimensions() {
  if (dimensionUpdateTimeout) {
    clearTimeout(dimensionUpdateTimeout);
  }
  
  dimensionUpdateTimeout = setTimeout(() => {
    const clipPathObj = croppingCanvas?.getObjects().find(o => o.id === 'clipPath');
    if (clipPathObj) {
      clipWidth.value = clipPathObj.width;
      clipHeight.value = clipPathObj.height;
    }
  }, 100);
}

// Event handlers for template
function onDimensionChange() {
  const clipPathObj = croppingCanvas?.getObjects().find(o => o.id === 'clipPath');
  if (clipPathObj) {

    const maxW = croppingImg.getScaledWidth();
    const maxH = croppingImg.getScaledHeight();

    clipWidth.value = Math.round(Math.min(clipWidth.value, maxW));
    clipHeight.value = Math.round(Math.min(clipHeight.value, maxH));

    clipPathObj.set({
      width: clipWidth.value,
      height: clipHeight.value
    });
    clipPathObj.setCoords();
    croppingCanvas.renderAll();
    
    // Ensure it stays within bounds
    limitClipMove({ target: clipPathObj });
    limitClipScale({ target: clipPathObj });
    croppingCanvas.renderAll();
  }
}

function cropImage() {
  if (!croppingCanvas || !croppingImg) {
    console.error('Canvas or image not available');
    return;
  }

  try {
    const clipPathObj = croppingCanvas.getObjects().find(o => o.id === 'clipPath');
    if (!clipPathObj) {
      console.error('ClipPath object not found');
      return;
    }

    // Calculate crop bounds
    const scaledWidth = clipPathObj.getScaledWidth();
    const scaledHeight = clipPathObj.getScaledHeight();
    const clipLeft = clipPathObj.left - scaledWidth / 2;
    const clipTop = clipPathObj.top - scaledHeight / 2;

    // Create temporary canvas for cropping
    const tempCanvas = new Canvas(null, {
      width: scaledWidth,
      height: scaledHeight
    });

    // Clone image for cropping
    croppingImg.clone().then((clonedImg) => {
      // Adjust position relative to crop area
      clonedImg.set({
        left: croppingImg.left - clipLeft,
        top: croppingImg.top - clipTop,
        originX: 'center',
        originY: 'center'
      });

      tempCanvas.add(clonedImg);
      tempCanvas.renderAll();

      // Extract cropped image as data URL
      const croppedDataURL = croppingCanvas.toDataURL({
        format: 'png',
        quality: 1,
        top: clipPath.top - clipPath.getScaledHeight() / 2,
        left: clipPath.left - clipPath.getScaledWidth() / 2,
        width: clipPath.getScaledWidth(),
        height: clipPath.getScaledHeight(),
        multiply: 1 / croppingImg.scaleX,
        enableRetinaScaling: true,
      });

      // Emit cropped image
      emit('image-cropped', {
        dataURL: croppedDataURL,
        width: scaledWidth,
        height: scaledHeight
      });

      // Cleanup temporary canvas
      tempCanvas.dispose();
    });

  } catch (error) {
    console.error('Error cropping image:', error);
    emit('crop-error', error);
  }
}

// Lifecycle hooks
onMounted(() => {
  setupCroppingCanvas();
});

// Watch for image prop changes
watch(() => props.image, async (newImage) => {
  if (newImage && croppingCanvas) {
    await setupCroppingImage();
  }
}, { deep: true });

// Watch for dimension changes
watch([clipWidth, clipHeight], () => {
  onDimensionChange();
});
</script>
