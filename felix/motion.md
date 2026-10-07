---
outline: false
---
<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vitepress'
const router = useRouter()
onMounted(() => router.go('/felix/components/catalog'))
</script>

# Components

Motion is built into the components by default, not a separate component or showcase.

[Open the Felix catalog](/felix/components/catalog).
