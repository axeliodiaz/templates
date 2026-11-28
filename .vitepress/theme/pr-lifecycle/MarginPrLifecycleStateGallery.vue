<script setup>
import PrlCopyBlock from './PrlCopyBlock.vue'
import MarginPrLifecycle from './MarginPrLifecycle.vue'
import { GALLERY_STATES, MOBILE_GALLERY } from './lifecycle-state-presets.mjs'
</script>

<template>
  <div class="mg-prl-state-gallery" data-tpl="margin">
    <article v-for="item in GALLERY_STATES" :key="item.id" class="mg-prl-state-gallery__item">
      <h4 class="mg-prl-state-gallery__title">{{ item.title }}</h4>
      <MarginPrLifecycle
        :state="item.id"
        :open="item.open"
        :motion="false"
        :autoplay="false"
      />
      <PrlCopyBlock :label="item.id" :code="item.code" />
    </article>

    <h3 id="mobile-gallery">Mobile (375 px)</h3>
    <div class="mg-prl-state-gallery__mobile">
      <article v-for="item in MOBILE_GALLERY" :key="'m-' + item.id">
        <h4>{{ item.title }}</h4>
        <MarginPrLifecycle
          :state="item.id"
          :open="item.open"
          :motion="false"
          :autoplay="false"
        />
      </article>
    </div>
  </div>
</template>