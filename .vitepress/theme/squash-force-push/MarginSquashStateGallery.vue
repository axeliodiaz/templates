<script setup>
import MarginSquashForcePush from './MarginSquashForcePush.vue'
import SqCopyBlock from './SqCopyBlock.vue'
import { GALLERY_STATES } from './squash-state-presets.mjs'
</script>

<template>
  <div class="mg-sq-state-gallery" data-tpl="margin">
    <article
      v-for="item in GALLERY_STATES"
      :key="item.id"
      class="mg-sq-state-gallery__item"
    >
      <h4 class="mg-sq-state-gallery__title">{{ item.title }}</h4>
      <div class="mg-sq-state-gallery__stage">
        <MarginSquashForcePush
          :state="item.id"
          :push-progress="item.pushProgress ?? 0"
          :checks-expanded="item.checksExpanded ?? null"
          :motion="false"
          :autoplay="false"
        />
      </div>
      <SqCopyBlock :label="item.id" :code="item.code" />
    </article>
  </div>
</template>