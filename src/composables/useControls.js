import { ref } from 'vue';
import useCommonStore from '@/stores/common.js';


// Aplica estilos personalizados aos controles de transformação dos objetos
function applyStyleToControls(...objects) {
    const commonStore = useCommonStore();
    console.log(commonStore);
    
    const brandColor = commonStore.brandColor;
    objects.forEach(obj => {
        if (!obj) return;
        obj.set({
            borderColor: brandColor,
            cornerColor: brandColor,
            cornerStyle: 'circle',
            cornerSize: 10,
            transparentCorners: false,
            hasControls: true,
            hasBorders: true
        });
    });
}

export { applyStyleToControls };