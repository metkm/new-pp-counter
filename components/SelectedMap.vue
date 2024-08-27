<script setup lang="ts">
import type { StyleValue } from 'vue';

const props = defineProps<{
  src: string;
  appearPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}>();

const emit = defineEmits<{
  remove: [];
}>();

const container = ref<HTMLElement>();
const src = ref(props.src);

const style = ref<any>({
  top: `${props.appearPosition.y}px`,
  width: `${props.appearPosition.width}px`,
  height: `${props.appearPosition.height}px`,
  left: `${props.appearPosition.x}px`,
});

onMounted(() => {
  setTimeout(() => {
    style.value.top = `0px`;
    style.value.left = `0px`;
    style.value.width = "100%";
    style.value.height = "100%";
  }, 500);
});

watch(
  () => props.src,
  () => {
    style.value = {
      top: `${props.appearPosition.y}px`,
      width: `${props.appearPosition.width}px`,
      height: `${props.appearPosition.height}px`,
      left: `${props.appearPosition.x}px`,
      opacity: 0,
    };

    container.value?.addEventListener('transitionend', () => {
      emit("remove");
    })
  }
);
</script>

<template>
  <div ref="container" class="absolute z-50 transition-all" :style="style">
    <img :src="src" class="object-cover h-full w-full" />
  </div>
</template>
