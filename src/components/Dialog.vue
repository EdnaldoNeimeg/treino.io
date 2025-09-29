<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click="closeDialog"
    >
      <div 
        class="relative bg-white rounded-lg shadow-xl min-w-[600px] max-w-[90%] w-min mx-4 max-h-[98vh] overflow-hidden"
        @click.stop
      >
        <!-- Header do Modal -->
        <div 
          v-if="title || $slots.header || showCloseButton"
          class="flex items-center justify-between pl-4 py-2 pr-2 border-b border-gray-200"
        >
          <div>
            <h2 v-if="title" class="text-xl font-semibold text-gray-800">
              {{ title }}
            </h2>
            <slot name="header" />
          </div>
          <button
            v-if="showCloseButton"
            @click="closeDialog"
            class="p-2 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
          >
            <iconify-icon icon="mdi:close" class="text-xl text-gray-600"></iconify-icon>
          </button>
        </div>

        <!-- Conteúdo do Modal (Slot padrão) -->
        <div class="relative">
          <slot />
        </div>

        <!-- Footer do Modal -->
        <div 
          v-if="$slots.footer"
          class="p-4 border-t border-gray-200 bg-gray-50"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { watch } from 'vue';

// Define um nome de componente multi-palavra para atender a regra de lint
defineOptions({ name: 'AppDialog' });

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  dialogId: {
    type: String,
    default: null
  },
  title: {
    type: String,
    default: ''
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

// Função para fechar o dialog
const closeDialog = () => {
  emit('close', props.dialogId);
};

// Watch para controlar o overflow do body
watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
</script>

<style scoped>
/* Estilos específicos do Dialog se necessário */
</style>