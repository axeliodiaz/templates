<script setup>
import ArCopyBlock from './ArCopyBlock.vue'
import MarginAgentRouter from './MarginAgentRouter.vue'
import { GALLERY_STATES } from './router-state-presets.mjs'
</script>

<template>
  <div class="mg-ar-state-gallery" data-tpl="margin">
    <article v-for="item in GALLERY_STATES" :key="item.id" class="mg-ar-state-gallery__item">
      <h4 class="mg-ar-state-gallery__title">{{ item.title }}</h4>
      <div class="mg-ar-state-gallery__stage">
        <MarginAgentRouter
          :state="item.id"
          :target="item.id === 'routed' ? 'billing' : undefined"
          :motion="false"
          :autoplay="false"
        />
      </div>
      <ArCopyBlock :label="item.id" :code="item.code" />
    </article>
  </div>
</template>