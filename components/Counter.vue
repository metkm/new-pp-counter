<script setup lang="tsx">
const { songFolderNames, data } = await useGosumemory();
const { backgrounds } = await useSongs(songFolderNames);

const container = ref<HTMLElement>();
const appearPosition = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});
const showExpanded = ref(false);

const duration = computed(() => `${backgrounds.value.length * 1000}ms`);

watchDebounced(
  () => data.value?.menu?.bm.metadata.title as string,
  async (newValue, oldValue) => {
    if (newValue === oldValue) return;

    const bmName = data.value.menu.bm.path.folder;
    let element = document.querySelector(`li[data-name="${bmName}/"]`);


    requestAnimationFrame(() => {
      element?.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth"
      });

      container.value?.addEventListener(
        "scrollend",
        () => {
          if (!element) {
            return;
          }

          const rect = element.getBoundingClientRect();

          appearPosition.value = {
            height: rect.height,
            width: rect.width,
            x: rect.x,
            y: rect.y,
          };

          showExpanded.value = true;
        },
        {
          once: true,
          passive: true,
        }
      );
    });
  },
  { debounce: 500 }
);

const cacheRecords: Record<string, number> = {};

const spanCache = computed(() => {
  for (let index = 0; index < backgrounds.value.length; index++) {
    const element = backgrounds.value[index];
    if (cacheRecords[element.id]) continue;

    cacheRecords[element.id] = randomRange(1, 3);
  }

  return cacheRecords;
});
</script>

<template>
  <div class="relative rounded-xl max-w-md h-72 overflow-hidden">
    <div ref="container" class="h-full overflow-y-auto overflow-hidden">
      <ol class="grid grid-cols-5 gap-2">
        <li
          v-for="folder in backgrounds"
          :key="folder?.id"
          class="max-w-max min-h-24 overflow-hidden"
          :data-name="folder.name"
          :style="{ gridRow: `span ${spanCache[folder.id]}` }"
        >
          <img
            :src="folder?.src"
            loading="lazy"
            class="object-cover object-center w-full h-full"
          />
        </li>
      </ol>
    </div>

    <SelectedMap
      v-if="data?.menu && showExpanded"
      :src="`http://127.0.0.1:24050/Songs/${data.menu.bm.path.full}`"
      :appearPosition="appearPosition"
      @remove="showExpanded = false"
    />
  </div>
</template>

<style>
.parent {
  column-gap: 4px;
}

.child {
  break-inside: avoid-column;
}

@keyframes scroll-horizontal {
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(-100%);
  }
}

.scroll-animate {
  animation: scroll-horizontal linear infinite;
  animation-duration: v-bind(duration);
}

div::-webkit-scrollbar {
  display: none;
}
</style>
