<script setup>
const props = defineProps({
    position: {
        type: String,
        default: 'top'
    }
});
</script>
<template>
    <div
        class="scale-0 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 absolute flex max-w-44 min-w-16 text-center bg-[#393939] bg-opacity-70 text-white text-xs rounded z-50 transition-all"
        :class="[
            $attrs.class, {
                'top-full left-1/2 -translate-x-1/2 origin-top mt-4': position === 'bottom',
                'bottom-full left-1/2 -translate-x-1/2 origin-bottom mb-4': position === 'top',
                'left-full top-1/2 -translate-y-1/2 origin-left ml-4': position === 'right',
                'right-full top-1/2 -translate-y-1/2 origin-right mr-4': position === 'left',
            }
        ]">
        <div class="relative p-2 w-full">
            <div class="absolute text-center border-[8px] border-transparent w-0 h-0"
                :class="{
                    'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-[#393939] border-t-0': position === 'bottom',
                    'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-[#393939] border-b-0': position === 'top',
                    'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-[#393939] border-l-0': position === 'right',
                    'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-[#393939] border-r-0': position === 'left',
                }"
            ></div>
            <slot></slot>
        </div>
    </div>
</template>