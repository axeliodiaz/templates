import { inject, ref, type Ref } from 'vue'

/** Shared with MarginGuidePreview → inner BS6 demo roots. */
export function useMarginPreviewDark(): Ref<boolean> {
  return inject('marginGuidePreviewDark', ref(false))
}