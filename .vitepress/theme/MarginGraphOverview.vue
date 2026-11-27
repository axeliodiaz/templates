<script setup lang="ts">
import pagesData from './margin-graphs-pages.json'

const { groups, pages } = pagesData

function graphPagesInGroup(groupId: string) {
  return pages.filter((p) => p.group === groupId)
}
</script>
<template>
  <div class="margin-graph-overview">
    <p>
      Fifty Felix JSON chart types with Margin-styled previews. Each page documents motion (enter, shuffle, hover),
      accessibility, and agent instructions. All sample data is synthetic.
    </p>
    <section v-for="group in groups" :key="group.id">
      <h3>{{ group.title }}</h3>
      <ul>
        <li v-for="page in graphPagesInGroup(group.id)" :key="page.slug">
          <a :href="`/margin/graphs/${page.slug}`">{{ page.title }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>